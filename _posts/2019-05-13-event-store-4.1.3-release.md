---
title: "Event Store 4.1.3"
author: "Shaan Nobee"
layout: blog-post
category: 'Release Notes'
---

Event Store 4.1.3 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

Following the release of [version 5.0.1 last week](https://eventstore.org/blog/20190507/event-store-5.0.1-release/), we have now released a minor update to version 4 which contains several bug fixes backported from 5.0.1.

Some of the bug fixes are critical and we strongly recommend our users to upgrade to this version as soon as possible.

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/).

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=4.1.3-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 4.1.3
```

**Client Packages**  

No client packages have been released.

## Upgrade Procedure (Important)
The behaviour of the `$by_category` and multi-stream JavaScript projections has changed and thus it is important to follow the steps below during an upgrade.

1. Stop all projections. This will force the projections to write a checkpoint and when the node is restarted, events up to the checkpoint will not be processed again.
2. Do a rolling upgrade as usual: Stop, upgrade and launch one node at a time starting with slave nodes, then the master.

If you do not follow Step 1, your projections may fault with the following error and you will need to either reset the projection or manually adjust the checkpoint:
```
An event emitted in recovery for stream <stream> differs from the originally emitted event. Existing('<event type>', '<caused by tag>'). New('<event type>', '<caused by tag>')
```

## Event Store 4.1.3 Changelog

### Critical Bug Fixes

* [#1915](https://github.com/EventStore/EventStore/pull/1915) - **(Core Database)** Fix idempotent writes for cases where events have not yet been replicated  
This bug can cause the loss of events during idempotent writes. Here's a scenario of how it can happen in a 3-node cluster:
1. A client retries a write due to a timeout
2. The master sees the write as an idempotent write and immediately returns `Success` to the client although the original event write has not yet been replicated to a quorum number of nodes (2 in this case).
3. Both slave nodes go down and the write never gets replicated (or the same thing happens if there was only one slave node alive at that time and it goes down)
4. The client assumes that this write was committed due to the `Success` acknowledgement but the event was lost.
* [#1908](https://github.com/EventStore/EventStore/pull/1908) - **(Projections)** Fix passing of wrong object to _subscriptionDispatcher.Subscribed() call  
This bug can cause multi-stream projections (using `fromStreams` or `fromCategories`) to skip processing of an event when the projection is stopped and started.
* [#1920](https://github.com/EventStore/EventStore/pull/1920) - **(Index)** Fix assertion regarding # of midpoints cached  
This bug will prevent EventStore from starting up if no midpoints have been cached in a PTable V4 file. The logs will show the following stack trace:
```
Error in TableIndex.ReadOffQueue
EventStore.Core.Exceptions.CorruptIndexException: Less than 2 midpoints cached in PTable. Index entries: <num index entries>, Midpoints cached: 0
  at EventStore.Core.Index.PTable..ctor(String filename, Guid id, Int32 initialReaders, Int32 maxReaders, Int32 depth, Boolean skipIndexVerify) in
...
```
* [#1890](https://github.com/EventStore/EventStore/pull/1890) - **(Persistent Subscriptions)** Persistent subscriptions: Ignore replayed events during checkpointing  
This bug can cause persistent subscriptions to skip events when parked messages are replayed multiple times.

### Important Bug Fixes
* [#1914](https://github.com/EventStore/EventStore/pull/1914) - **(Scavenging)** Don't MarkForDeletion a chunk until all references to it have been swapped (thanks to [@lscpike](http://github.com/lscpike)!)  
This bug can cause read errors on the server side when a scavenged chunk is being swapped. A stack trace similar to the following will be printed to the logs:

```
Error during processing ReadStreamEventsBackward request.
EventStore.Core.Exceptions.FileBeingDeletedException: Been told the file was deleted > MaxRetries times. Probably a problem in db.
  at EventStore.Core.TransactionLog.Chunks.TFChunkReader.TryReadAtInternal (System.Int64 position, System.Int32 retries)
...
```
* [#1919](https://github.com/EventStore/EventStore/pull/1919) - **(User Management)** Retry reading from `$users-password-notifications` stream if the read times out  
This bug prevents user updates (password, group changes and deletions) from taking effect on the node until it is restarted.
* [#1900](https://github.com/EventStore/EventStore/pull/1900) - **(Projections)** Fix `$by_category` processing of stream deleted events  
This bug fix prevents metadata events from being emitted into `$ce-<category>` streams except if they are stream deleted metadata events.

### Miscellaneous Bug Fixes
* [#1921](https://github.com/EventStore/EventStore/pull/1921) - **(Projections)** Add missing assignment to ProjectionsQueryExpiryDefault (thanks to [@mcollins4551](http://github.com/mcollins4551)!)
* [#1873](https://github.com/EventStore/EventStore/pull/1873) - **(Monitoring)** Write stats csv header when date changes (when stats file rolls over)
* [#1926](https://github.com/EventStore/EventStore/pull/1926) - **(Monitoring)** Increase the slow queue message threshold to 800ms for the MonitoringQueue
* [#1888](https://github.com/EventStore/EventStore/pull/1888) - **(HTTP API)** Do not send Content-Type header when body is empty
* [#1881](https://github.com/EventStore/EventStore/pull/1881) - **(HTTP API)** Try to deserialize data or metadata string to JSON object when writing through HTTP API
* [#1884](https://github.com/EventStore/EventStore/pull/1884) - **(HTTP API)** Handle GET and POST requests on /users endpoints (instead of only /users/)
* [#1918](https://github.com/EventStore/EventStore/pull/1918) - **(Scavenging)** Add regular file flushes whilst writing out scavenged chunk  (thanks to [@lscpike](http://github.com/lscpike)!)  
* [#1886](https://github.com/EventStore/EventStore/pull/1886) - **(Subscriptions)** Fix issue where proto3 clients could not subscribe to $all
* [#1887](https://github.com/EventStore/EventStore/pull/1887) - **(Windows)** Use absolute path as mutex name when starting up node

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).