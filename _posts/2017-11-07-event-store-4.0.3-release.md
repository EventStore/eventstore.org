---
title: "Event Store 4.0.3 Released"
author: "Hayley Campbell"
layout: blog-post
category: 'Release Notes'
---

Event Store 4.0.3 has been released! It is available for the following operating systems:

- Windows (via Chocolatey)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

We have still been working on improving projections, and included in this release is a fix for one of the remaining large issues with projections.
A few people have experienced this problem, which causes the projection to fault with the error `An event emitted in recovery differs from the originally emitted event`. Please note that if you have any projections affected by this, the projection will not automatically be fixed, and a manual reset is required.

## Event Store 4.0.3 release notes

## Event Store Server

- [#1442](https://github.com/EventStore/EventStore/pull/1442) - **(All Platforms)** - Exempt internal tcp service from PendingSendBytes
- [#1434](https://github.com/EventStore/EventStore/pull/1434) - **(All Platforms)** - Fix slave-to-master forwarding issues when a header has the wrong formatting
- [#1417](https://github.com/EventStore/EventStore/pull/1417) - **(All Platforms)** - Prevent perfcounters from stopping MonitoringService
- [#1424](https://github.com/EventStore/EventStore/pull/1424) - **(Windows)** - Fetch the correct performance counter instance for specific process specific
- [#1426](https://github.com/EventStore/EventStore/pull/1426) - **(All Platforms)** - Allow the skipping of index scans on reads

## Event Store Server - Projections

- [#1444](https://github.com/EventStore/EventStore/pull/1444) - **(All Platforms)** - Fault a projection if it encounters an unexpected event number to prevent it from computing a potentially incorrect state. This can happen when starting a projection and the next expected event has been deleted from the stream (for example, if applying $maxAge or $maxCount to the stream). The projection needs to be manually reset.
- [#1440](https://github.com/EventStore/EventStore/pull/1440) - **(All Platforms)** - Only start projections on the master node
- [#1418](https://github.com/EventStore/EventStore/pull/1418) - **(All Platforms)** - Delete order stream when projection is deleted
- [#1425](https://github.com/EventStore/EventStore/pull/1425) - **(All Platforms)** - Handle stream deletions in MultiStreamEventReader
- [#1398](https://github.com/EventStore/EventStore/pull/1398) - **(All Platforms)** - Use a unique projection control stream id
- [#1400](https://github.com/EventStore/EventStore/pull/1400) - **(All Platforms)** - When stopping projections ensure that all the relevant processes related to the projections are stopped. This resolves an issue which surfaces as An event emitted in recovery differs from the originally emitted event.
- [#1404](https://github.com/EventStore/EventStore/pull/1404) - **(All Platforms)** - Don't fail if there are duplicate projection created events
- [#1410](https://github.com/EventStore/EventStore/pull/1410) - **(All Platforms)** - Resolve an issue where projections are stuck on startup.

## Event Store Server - Persistent Subscriptions

- [#1438](https://github.com/EventStore/EventStore/pull/1438) - **(All Platforms)** - Fix bug when Replaying parked Messages with an empty park stream
- [#1397](https://github.com/EventStore/EventStore/pull/1397) - **(All Platforms)** - Forward ack and nack http requests for persistent subscriptions to the master node.

## Event Store UI

- [#160](https://github.com/EventStore/EventStore.UI/pull/160) - Show projection failure reason in list.
- [#162](https://github.com/EventStore/EventStore.UI/pull/162) - Allow users to get projection state by a partition
- [#163](https://github.com/EventStore/EventStore.UI/pull/163) - Query this stream
- [#165](https://github.com/EventStore/EventStore.UI/pull/165) - Enable maximize/minimize projection editor on edit screen
- [#168](https://github.com/EventStore/EventStore.UI/pull/168) - Allow user to add an event to a stream
- [#169](https://github.com/EventStore/EventStore.UI/pull/169) - Remember the last query in local storage unless overrides are specified
- [#172](https://github.com/EventStore/EventStore.UI/pull/172) - Add new events to any (arbitrary) stream from the stream browser
- [#173](https://github.com/EventStore/EventStore.UI/pull/173) - Set ace edit language to text for special projections

## .NET Client

- [#1394](https://github.com/EventStore/EventStore/pull/1394) - **(All Platforms)** - Change the catchup subscription for $all to use a do..while loop
- [#1396](https://github.com/EventStore/EventStore/pull/1396) - **(All Platforms)** - Fixed ProjectionsManager's GetResultAsync and GetPartitionResultAsync
- [#1414](https://github.com/EventStore/EventStore/pull/1414) - **(All Platforms)** - Make ProjectionsManager work with Hostname
- [#1415](https://github.com/EventStore/EventStore/pull/1415) - **(All Platforms)** - Cleans up handling of creating connection from gossip seeds or uri
- [#1435](https://github.com/EventStore/EventStore/pull/1435) - **(All Platforms)** - Allow changing of custom metadata properties in the client StreamMetadataBuilder
