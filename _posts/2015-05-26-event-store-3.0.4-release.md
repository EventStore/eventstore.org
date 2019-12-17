---
title: "Event Store 3.0.4 Released"
author: "James Nugent"
layout: blog-post
category: 'Release Notes'
---

Event Store 3.0.4 contains a fix for a bug in initial replication of merged transaction file chunks, and numerous fixes in the user interface. It is now available both to users of the open-source product, and to commercial customers. Commercial customers will find the release builds of Event Store 3.0.4 in their download areas.

The release notes for Event Store 3.0.3 are below.

Event Store Server
------------------

- Fixed a bug which could cause a replica to enter an infinite loop during initial replication of merged chunks.

Event Store UI
-----------------

- Fixed an issue that was preventing copying event data from the head of a stream. See [#60](https://github.com/EventStore/EventStore.UI/issues/60).
- The UI will now redirect to desired page after authentication. See [#59](https://github.com/EventStore/EventStore.UI/issues/59).
- Fixed a series of memory/performance issues plaguing the UI. See [#58](https://github.com/EventStore/EventStore.UI/issues/58).
- The poller now behaves correctly and on the head of a stream, the user will now see events as they appear in the stream. The user also has the ability to pause the poller such that event data can be copied or inspective. See [6cd04029](https://github.com/EventStore/EventStore.UI/commit/6cd04029f64bd5cfadffac08500710c9f37262e8).
