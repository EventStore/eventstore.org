---
title: "Event Store 3.9.3 Released"
author: "Pieter Germishuys"
layout: blog-post
category: 'Release Notes'
---

Happy thanksgiving to everyone that celebrates it. We have just released Event Store 3.9.3. This release includes a set of fixes and will likely be the last 3.x release before Event Store 4.0.0. The fixes in the release are mainly focussed around an issue that could have resulted in duplicate entries being written due to a hash conflict between stream names occurring.

## When will Event Store 4.0.0 be released?

As this is a major version, and the anticipated release of projections, we are working very hard to ensure that we meet our expectations and release before the end of the year. You can expect to receive an email as we get closer to the release which will detail what this release contains, as well as possible pre-release versions.

## More details on the hash collision and duplicate entry fix

A stream that has been affected by this particular issue is considered unreadable. Event Store 3.9.3 will restore the stream to a readable state and a scavenge will remove the erroneous events from all the affected streams.

The message stems from a validation that is performed as a last set of checks that are performed before the read operation returns to the client. In particular, one of the checks ensures that the events that were read are in the correct order. The message is indicating that they were not in order, due to another event at position 0 appearing in the slice of events that were read.

The conditions that need to be in place for the above issue to occur is all of the following:

- The last correct event number for the destination stream should not be cached. (When you write to a stream, or the in memory index is built up on a node restart, the event numbers for the streams are cached).
- 2 streams have the same hash. i.e. a hash collision needs to occur.
- The hash collision read limit has to be exhausted. For example:
    - stream-x has a 1 events.
    - stream-y has a 100 events.
    - We try and find the last event for stream-x, but keep reading stream-y’s events as we are going through the index, we eventually exhaust the hash collision read limit and return `NoStream`.

By upgrading to 64bit indexes, you are unlikely to run into a hash collision which is why it will reduce the likelihood of this issue re-occurring. Also, if you are running with 3.9.x, new indexes that are created will always be 64bit indexes, also when a merge takes place, the merge will result in a 64bit index (This is how Event Store will eventually upgrade all your indexes to 64bit indexes).

In the cases where a normal scavenge does not remove the duplicate events due to the scavenged chunk not being compacted, we have added an option (`--always-keep-scavenged`, `AlwaysKeepScavenged: true`) that will ensure that the scavenged chunk is kept. You don’t want to always run with the option turned on and therefore we suggest that you only run a scavenge with this option turned on once.

## Event Store Server 3.9.3 release notes

- [#1099](https://github.com/EventStore/EventStore/pull/1099) **(All Platforms)** Fix 2 additional duplicate entry issues.
    - when the duplicate entry is in the memory table and when rebuilding the memory table on node startup.
    - when the duplicate entry is cached as the last event number.
- [#1080](https://github.com/EventStore/EventStore/pull/1080) **(All Platforms)** Fix performance counters for a process.
- [#1078](https://github.com/EventStore/EventStore/pull/1078) **(All Platforms)** Fix expectations from exhausting the hash collision read limit.
- [#1075](https://github.com/EventStore/EventStore/pull/1075) **(All Platforms)** Start the persistent subscription from the event after the checkpoint.
- [#1104](https://github.com/EventStore/EventStore/pull/1104) **(All Platforms)** Add option to always keep scavenged chunks.