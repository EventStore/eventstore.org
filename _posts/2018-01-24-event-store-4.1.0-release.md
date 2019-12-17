---
title: "Event Store 4.1.0 Release"
author: "Hayley Campbell"
layout: blog-post
category: 'Release Notes'
---

We are excited to announce that Event Store 4.1.0 has just been released! It is available for the following operating systems:

- Windows (via Chocolatey)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

This version was originally set to be version 4.0.4, and is based on the 4.0.4 release candidate.
We decided to bump up the version to 4.1.0 due to the large number of changes in this release, and because the new index version is not backwards compatible (more on that below.)

## Index Improvements

Loading indexes have a large impact on the startup times of Event Store. This is due to two processes that happen every time Event Store starts :

1. Index verification - this hashes each index file and verifies it against the hash stored in its footer.
Since this needs to read through the entire file, this will take longer for larger files and indexes.
2. Loading and caching midpoints - this happens at the same time as the verification above.
Event Store caches midpoints from the index files into memory. This makes searching the index much quicker.

The improvements in this release focus specifically on these two processes.

Firstly, index verification can now be disabled. This means that the entire index file no longer needs to be read on startup.
Some extra checks have instead been added to check for possible corruption of the indexes. If any potential corruption is discovered while running, a file is created to indicate that verification must be run at the next startup. If there is anything wrong, then the indexes will be rebuilt as per usual.

Secondly, midpoints are now written to the footer of new index files. This allows Event Store to load up the midpoints without recalculating them on every run.

These improvements won't always be immediately apparent. There are some steps required to benefit from these changes:

1. Run Event Store with index verification disabled with the `--skip-index-verify` option.
2. The index files need to be upgraded to the latest version (more on this below.)

## Index Compatibility

Because of the changes mentioned above, the indexes are not backward compatible.
Any index written in 4.1.0 will be considered corrupt by any versions before it.
You might want to back up your indexes before upgrading so that if you do want to roll back, you can restore the indexes from backup rather than rebuilding them from scratch.
If you wish to roll back and do not have your previous indexes backed up, you can rebuild them as recommended below.

## Upgrading and Rebuilding Indexes

The indexes will upgrade naturally as more data is written to Event Store and the index files are upgraded during merges.
This can take a considerable amount of time if you have a lot of data.

If you would like to force the indexes to upgrade, you can do this by rebuilding all your indexes upfront.
You can do this by simply stopping a node, deleting its index files, and restarting it.
Please be aware that the index rebuild is a time-consuming process.

If you would like to rebuild your indexes with minimal downtime, you can rebuild the indexes on a separate, faster node and then restore them to the original cluster.

To do that, you would need to do the following :
1. Back up the data of one of your nodes. You can find the backup steps [here](https://eventstore.org/docs/server/database-backup/).
2. Copy the backed up database to a separate machine - for example, a fast dev machine. You do not need to copy the indexes.
3. Ensure that the indexes have been deleted.
4. Start up Event Store as a single node pointing to the backed up data.
5. Wait until the index rebuild is done.
6. Restore the index to the original nodes.

## Replication changes

This release also changes the way the index is updated with a new write, as well as how events are read from $all.

Previously the index was updated as soon as possible after an event had been written to disk on a node. This means that an event could be added to the index before it has been replicated to other nodes in the cluster. Consequently if a client were to read or subscribe to that stream, it could receive an event that does not yet exist in the entire cluster.

As an example, consider the following scenario :

1. Take a 3 node cluster with nodes A, B, and C. A is the current master node.
2. A client subscribes to StreamA on node A.
3. The network between node A and the others goes down. This means that node A can no longer replicate data to the two slaves.
4. An event is written to StreamA on node A and is written to disk. The client that sent the event will get a Commit Timeout.
5. The client receives the event and acts upon it.
6. Node A goes down completely.

Because the event was never replicated to any of the other nodes, that event no longer exists. If that event is not retried, then our client may have acted on an event that essentially never happened.

Another common result of the above scenario is the client resubscribing to one of the other nodes, but the position it tries to subscribe from is no longer valid. This causes the subscription to throw errors, and means that the client will need to resubscribe from a known valid position.

## Projections

We are still working on improvements for projections and aiming to make them more stable and reliable.

There are two fixes in this RC for projections not starting up correctly, as well as a performance improvement for multi-stream projections.
Additionally, the issue where projections may be deleted if they take a few minutes to start up has been fixed.

## Event Store 4.1.0 release notes

## Event Store Server

- [#1447](https://github.com/EventStore/EventStore/pull/1447) - **(All Platforms)** - Add gzip & deflate support for Accept-Encoding HTTP header
- [#1448](https://github.com/EventStore/EventStore/pull/1448) - **(All Platforms)** - Prevent reads of events that have not been replicated
- [#1461](https://github.com/EventStore/EventStore/pull/1461) - **(All Platforms)** - Add traverse in scavenge to count the new chunk size in memory
- [#1469](https://github.com/EventStore/EventStore/pull/1469) - **(All Platforms)** - Ensure CurrentVersion is set when forwarding writes
- [#1476](https://github.com/EventStore/EventStore/pull/1476) - **(All Platforms)** - Make PasswordChangeNotificationReader try again in case of a read error
- [#1485](https://github.com/EventStore/EventStore/pull/1485) - **(All Platforms)** - Allow the user to skip verification of index integrity on startup
- [#1491](https://github.com/EventStore/EventStore/pull/1491) - **(All Platforms)** - Cache midpoints in Ptable footer for faster startup times
- [#1504](https://github.com/EventStore/EventStore/pull/1504) - **(All Platforms)** - Fix an issue during the index upgrade from PTable V1 to V2 or later that may cause entries to be lost
- [#1510](https://github.com/EventStore/EventStore/pull/1510) - **(All Platforms)** - Fix case where master node may crash after 2 consecutive elections
- [#1515](https://github.com/EventStore/EventStore/pull/1515) - **(All Platforms)** - Fix bug where a forwarded request's Content-Type was omitted if Content-Length is 0
- [#1520](https://github.com/EventStore/EventStore/pull/1520) - **(All Platforms)** - Fix for scavenged files remaining at 256MB
- [#1522](https://github.com/EventStore/EventStore/pull/1522) - **(All Platforms)** - Add option to set initial reader count on TFChunk
- [#1534](https://github.com/EventStore/EventStore/pull/1534) - **(All Platforms)** - Safeguard the parsing of ContentType header in case it is empty

## Event Store Projections

- [#1460](https://github.com/EventStore/EventStore/pull/1460) - **(All Platforms)** - Use current epoch (epoch-0) when starting up projections - fix projections stuck on startup
- [#1465](https://github.com/EventStore/EventStore/pull/1465) - **(All Platforms)** - Stop reading the order stream once the checkpoint has passed
- [#1466](https://github.com/EventStore/EventStore/pull/1466) - **(All Platforms)** - Prevent 2 instances of ProjectionCoreCoordinator & its subcomponents from running in parallel
- [#1484](https://github.com/EventStore/EventStore/pull/1484) #1489) - **(All Platforms)** - Expire long-running queries and make expiration configurable and prevent projections from being expired if they haven't loaded state
- [#1523](https://github.com/EventStore/EventStore/pull/1523) - **(All Platforms)** - Initial projection state was not set in the checkpoint manager

## Event Store Persistent Subscriptions

- [#1471](https://github.com/EventStore/EventStore/pull/1471) - **(All Platforms)** - Convert timeout of 0 to no timeout when loading config on startup

## .NET Client

- [#1472](https://github.com/EventStore/EventStore/pull/1472) - **(All Platforms)** - Fixed system projection query update
- [#1487](https://github.com/EventStore/EventStore/pull/1487) - **(All Platforms)** - Add retry status to persistent subscriptions
- [#1511](https://github.com/EventStore/EventStore/pull/1511) - **(All Platforms)** - Creates A Public Constants Class for Client Use

## Event Store UI

- [#182](https://github.com/EventStore/EventStore.UI/pull/182) - Allow easy copying of projection name