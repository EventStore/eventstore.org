---
title: "Event Store 3.4.0 Released"
author: "Pieter Germishuys"
layout: blog-post
---

Event Store 3.4.0 is now released! The headline feature is the addition of the [HTTP API for “competing consumers”](/docs/http-api/3.4.0/competing-consumers), but there have been numerous other improvements and bug fixes. We have also moved from [self hosting](https://apt-oss.eventstore.org/index.html) our Event Store packages to hosting the packages on [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS).

There is also an accompanying update to the .NET Client API and the Embedded Client. These are now in the NuGet gallery.

The release notes for 3.4.0 are listed below, along with the release notes for 3.3.1 for completeness (they were posted on the GitHub release but never on this blog).

## Event Store Server 3.4.0 release notes

- [#780](https://github.com/EventStore/EventStore/pull/780) **(All Platforms)** Correctly set head of stream when reading forward (Only Affects Atom Feeds).
- [#777](https://github.com/EventStore/EventStore/pull/777) **(All Platforms)** Introduce a new competing consumers strategy (Pinned).
- [#776](https://github.com/EventStore/EventStore/pull/776) **(All Platforms)** Add a plugin model for persistent subscription consumer strategies.
- [#770](https://github.com/EventStore/EventStore/pull/770) **(All Platforms)** Expose Authentication Config via options.
- [#768](https://github.com/EventStore/EventStore/pull/768) **(All Platforms)** Fix histogram race condition.
- [#766](https://github.com/EventStore/EventStore/pull/766), [#765](https://github.com/EventStore/EventStore/pull/765) **(All Platforms)** Remove check for first/last on AlreadyCommitted for case where many events with same ids are used.
- [Commit](https://github.com/EventStore/EventStore/commit/1450ab78802f45b467d78cc40aa23f59625f1669) **(All Platforms)** Check for null event and data on event when processing events for projections.
- [#762](https://github.com/EventStore/EventStore/pull/762) **(All Platforms)** Move usages of dates to Utc Now from Now.
- [#759](https://github.com/EventStore/EventStore/pull/759) **(All Platforms)** Introduce a new role (ops) which has permissions to perform scavenge, monitor through the web UI as well as shutting down event store nodes. With this a new default user will be introduced called `ops`.
- [#749](https://github.com/EventStore/EventStore/pull/749) **(All Platforms)** Set a sane default for message timeouts (10 seconds) (Competing Consumers).
- [#737](https://github.com/EventStore/EventStore/pull/737) **(All Platforms)** Add HTTP Competing Consumers. Documentation can be found [here](/docs/http-api/3.4.0/competing-consumers)

## Event Store UI 3.4.0 release notes

- [#106](https://github.com/EventStore/EventStore.UI/pull/106) Update the stored/cookie credentials when necessary.

## .NET Client 3.4.0 release notes

- [#722](https://github.com/EventStore/EventStore/pull/722) Add ability to fetch partition state and result to the ProjectionManager in the .NET client.

## Event Store Server 3.3.1 release notes

- [#729](https://github.com/EventStore/EventStore/pull/729) **(All Platforms)** Ensure that the max client read size (4096) is adhered to. Check the status of the projection before handling an enable.
- [#728](https://github.com/EventStore/EventStore/pull/728) **(All Platforms)** Remove the double hash in run-node scripts.
- [#727](https://github.com/EventStore/EventStore/pull/727) **(All Platforms)** Add the ability to specify where the index is to be stored. This option is exposed via the options system (command line, environment and config file).
- [#744](https://github.com/EventStore/EventStore/pull/744) **(All Platforms)** Message timeouts now uses UTC instead of local timestamps.
- [#740](https://github.com/EventStore/EventStore/pull/740) **(All Platforms)** Moving the subscriptions to concurrent dictionary. There were issues related due to dictionary and threading highlighted in this [Google Groups discussion](https://groups.google.com/forum/#!topic/event-store/991cAF157bM).
- [#734](https://github.com/EventStore/EventStore/pull/734) **(All Platforms)** Improved replication performance in 5 node clusters.
- [#730](https://github.com/EventStore/EventStore/pull/730) **(All Platforms)** Honour projection authorisation.

## Event Store UI 3.3.1 release notes

- [Commit](https://github.com/EventStore/EventStore.UI/commit/f177ebc7f4cfa76bcecb49479bfb15634cb9a534) When creating a persistent subscription and it fails, show the reason for the failure.
- [Commit](https://github.com/EventStore/EventStore.UI/commit/3383d8c827aff62d15c902d457634c388fc6e074) Include a view to show the status of the cluster.