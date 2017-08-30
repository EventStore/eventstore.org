,
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Internal Architectural Overview"
section: "Introduction"
version: "3.1.0"
---

## Messaging

The overall architecture style of the Event Store is [SEDA (Staged Event Driven Architecture)](http://www.eecs.harvard.edu/~mdw/proj/seda). Messages flow forward through queues internally (including the Transaction File which is also a queue). There are communication end points that flow forward through series of queues to be processed. All operations are purely asynchronous. The core processing is handled on a single thread reading requests off of a single concurrent queue.

Messages first flow through a state machine that represents the state of the node. As an example in a distributed scenario you are not always allowed to write (slaves will forward not write themselves) or if you are still initializing you are not allowed to read. Each request is also handled by a state machine that manages the lifecycle of that request including time outs and acknowledgements throughout the cluster.

Due to the way the architecture works the main monitoring points of the Event Store is the status of the queues. The status can be viewed in the health area of the admin interface or through the HTTP API. It is also written to a special $statistics-node:port stream on an interval. 

The most common queue to be slow is the storage writer as it writes to storage in a durable fashion. It uses fsync/flushfile buffers to ensure that data is persisted to disk and will survive say a power outage on the machine. At the time of writing the storage writer is capable of writing more than 15,000 transactions to disk per second on the open source single node version. This is well beyond the needs of most systems.

## Transaction File

The Event Store provides durable storage including handling cases where the power may be turned off on a machine. It does this through the use of a commit log. The commit log is a conceptual constantly appending file (though it is not implemented this way). Every write to the event store appends to this file.

The commit log is built not as one large file but as a series of small files implemented with an abstraction called a TFChunk. For all of the files it writes the EventStore only ever writes sequentially (with the exception of checkpoints, although there is a non-performing sequential version of checkpoints too).

This results in no seeks being necessary for writes. While less of a problem with SSDs this can drastically help with performance of spindle drives. It also allows for the possibility that data for the Event Store (both indexes and the transaction file) could be stored on write once media.

Entire TFChunks are cached. This is done by loading the entire chunk into unmanaged memory. Most of the memory usage by the Event Store is unmanaged. It is rare to see it use more than a few hundred megabytes in managed heaps. Even in these scenarios most of the memory is in the large object heap (LOH) and point to native types such as `byte[]` to put a minimum load possible on the garbage collector.

## Scavenging

The chunks in the Transaction File are periodically scavenged to remove deleted or old data depending on stream rules such as `$maxCount` in stream metadata and can be compacted (wouldn’t it be awful to have 5,000 160KB files?).

This process generates new chunks and switches them out atomically deleting them once they are no longer in use by readers. This gives the benefit that, once completed, TFChunks are immutable. This includes the current chunk. Since it is only written to sequentially it will never seek back to overwrite something.

Every record in the log has an ID. The ID is the logical position at which the record was originally written to disk. This is useful as an identifier as in a scenario where you are not deleting you know exactly where the record is stored.

When you begin scavenging however this location can move. As part of the process of scavenging a TFChunk a map is written of remappings from the original IDs. This is crucial because index points back to these IDs. This map allows the index and the TFChunks to be scavenged independently. If, during the scavenge process, it is found that the overhead of the map outweighs the benefit of the scavenge the scavenge will not be performed.

Chunks that are completed also have an MD5 checksum to validate the data inside of them since disks do occasionally go bad or mangle data. This checksum is checked periodically to validate that the data has not been corrupted.

## Index

There is only one index in the Event Store. Projections should be used for building application level indexes. The index is immutable.

Queries executed against the Event Store are always to get an event which is represented as a sequence number inside of a stream. The index is optimized for this purpose.

Each record in the index is 16 bytes:

- 4 bytes for the hash of the stream ID
- 4 bytes for the sequence number
- 8 bytes for the original position the record had in the log.

This identifier of a record is quite useful as you can avoid additional lookups when writing the record to disk, however this can change due to scavenging of the transaction file.

As transactions are written to the Transaction File an in-memory index is appended. A query hits the in memory index. The in-memory index is at this time implemented as a hash of sorted lists with a fine grained lock on the stream.

In experimenting with various data structures including redblack trees and B+ trees it turned out that the fine grained lock outperformed the others (a good example of how stupid code can often be faster than well thought out code).

When there are enough items in the in memory index, the index will be flushed to disk (known as a PTable or Persistent Table). A PTable is just a sorted group of index entries (remember that they are only 16 bytes each). To search a binary search accross the PTables is used. The search function however has been memoized by storing midpoints in memory (in the future likely ptables will be stored in unmanaged memory as well however the performance on SSDs is very acceptable with only midpoint caching). Mid point caching reduces the number of seeks from log(n) by the depth to which midpoints are filled and often all are in memory.

When a PTable is written a checksum is marked as to the last place in the transaction file the persistent tables cover to. If the system were to shut down in must rebuild a memtable from that point forward on start up. With default settings the max is 1m items which takes about 3 seconds on most machines tested. This value can be tweaked via the command line as well.

PTables also get merged into larger PTables over time. During this operation they are also scavenged for items that are to be removed. The merging of N PTables to 1 larger PTable is a linear opertation as they are all sorted. PTables once written to disk are immutable and have like tf chunks MD5 checksums. Unlike a failure in a TFChunk checksum however if a problem is found within the index it is simply rebuilt.
