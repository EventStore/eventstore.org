---
title: "Event Store 4.0.3 Hotfix"
author: "Hayley Campbell"
layout: blog-post
---

A hotfix for Event Store 4.0.3 has been released.


This release addresses a potential issue that is caused by upgrading indexes from 32 bit to 64 bit hashes during an index merge.
The issue causes index entries to be removed during a merge in specific circumstances, which results in the affected events being unreadable except through $all.

This hotfix only prevents the issue from happening in the future, it will not fix the affected indexes.
If you have experienced this issue, then you will need to rebuild your indexes to restore the missing events.

The hotfix can be downloaded from :

- Windows (via Chocolatey)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

## What is the issue?

To fully explain what causes this issue, we need to first cover some details about how the index is made and how index merges happen.

The index for Event Store is made up of a memory index and zero or more index files stored on disk called PTables.
Each index entry is made up of a hash of the stream id, the event version, and the log position of the event.
The entries in each PTable are sorted by hash then version in descending order.

The index is stored in memory until it reaches a certain number of events (1,000,000 by default) at which point it will write a PTable.
This process repeats - more events are stored in memory until the index is ready to write a new PTable.
At the point where a second PTable is written, the index checks to see if they can be merged together. Any PTables that have the same number of entries are eligible to be merged.

The index then loads both of the PTables, sorts them together and writes all the entries down to disk as a single PTable.
During the merge process, each entry is checked against the TFChunks to ensure that the entry still exists in the data. If it doesn't, the entry is removed.
This is also the time when the hashes will be upgraded if the original file was written with 32bit stream hashes.

It is during this merge and upgrade process that the issue may occur.
If two adjacent streams in a PTable have all their events removed, there is a chance that all the entries after those streams will be dropped.
This results in entries missing from the index, which makes them unreadable except through $all.

For this to happen, the following conditions must be met :
- The PTable must be V1 i.e. created in an Event Store with a version of 3.8.x or lower
- The one stream's hash must follow directly on from the other's
- Every event in the PTable that belong to the streams mentioned above must have been removed from the data i.e. deleted and scavenged
- The merge taking place will result in a hash upgrade from 32bit to 64bit

## Am I affected?

If all of the following apply to you, then it is possible that you have been affected :

1. Has your Event Store ever had V1 indexes? i.e. Was this Event Store ever running a version 3.8.x or lower?
2. Have any of your index files been upgraded to V2 or V3? The index versions are printed in the logs when the node starts up.
3. Has your data been scavenged? You can determine this by looking at the chunk files.
If the final number in the file name is greater than 000000 e.g. chunk-000002.000001, then that chunk has been scavenged.

## What is the resolution?

If you have been affected by this issue, you will need to rebuild your indexes.

To minimise downtime, you can rebuild indexes on another machine - for example a faster dev machine - and restore them to your cluster.
The steps to do this would be as follows :
1. Back up one of your nodes.
2. Restore the database files from the backup on a separate machine - you don't need to restore the index.
3. Start the instance and allow it to rebuild the indexes.
4. Once the indexes have been built, restore just the indexes to the nodes in the cluster, starting with the slaves and ending with the master.

## Event Store 4.0.3 Hotfix release notes

## Event Store Server
 
- [#1471](https://github.com/EventStore/EventStore/pull/1471) - **(All Platforms)** - Convert timeout of 0 to no timeout when loading config on startup.
- [#1482](https://github.com/EventStore/EventStore/pull/1482) - **(All Platforms)** - Allow connecting with SSL when using the testclient.
- [#1504](https://github.com/EventStore/EventStore/pull/1504) - **(All Platforms)** - Fix an issue with indexes where entries may be lost during an upgrade from V1 to V2.
