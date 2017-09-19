---
title: "Event Store 3.5.0 Released"
author: "Pieter Germishuys"
layout: blog-post
---

Event Store 3.5.0 is now released! As we are moving forward from 3.5.0, projections will be the main focus of the releases leading up to version 4.0 (The intended version for projections to be a supported production feature). There have been numerous other improvements and bug fixes.

There is also an accompanying update to the .NET Client API and the Embedded Client. These are now in the NuGet gallery.

## Event Store Server 3.5.0 release notes

- [#782](https://github.com/EventStore/EventStore/pull/782) **(All Platforms)** Show scavenges and their statuses in the UI.
- [#792](https://github.com/EventStore/EventStore/pull/792) **(All Platforms)** Show TCP connections and their statistics in the UI.
- [#793](https://github.com/EventStore/EventStore/pull/793) **(All Platforms)** Default the db to the current directory if an Access Denied exception is encountered.
- [#794](https://github.com/EventStore/EventStore/pull/794) **(All Platforms)** Adds logging for http requests and responses. Enabled via the LogHttpRequests option.
- [#799](https://github.com/EventStore/EventStore/pull/799) **(All Platforms)** Shows statistics about replicas in a cluster.
- [#808](https://github.com/EventStore/EventStore/pull/808) **(All Platforms)** External TCP service will now use the correct heartbeat interval.
- [#809](https://github.com/EventStore/EventStore/pull/809) **(All Platforms)** Projections routes will now return 404 if projections aren’t enabled. Was previously timing out.
- [#811](https://github.com/EventStore/EventStore/pull/811) **(All Platforms)** Add Trusted Writes to TCP. This enables nodes to send writes over the internal TCP connection if the user is a trusted user. In this case, system.
- [#813](https://github.com/EventStore/EventStore/pull/813) **(All Platforms)** Projections will no longer get stuck in preparing in failover/takeover scenarios.
- [#816](https://github.com/EventStore/EventStore/pull/816) **(All Platforms)** Fix incorrect arguments in verbose logging in the client API.
- [#818](https://github.com/EventStore/EventStore/pull/818) **(All Platforms)** Persistent Subscription correctly reflect last known event number.
- [#819](https://github.com/EventStore/EventStore/pull/819) **(All Platforms)** Introduce a System Ready message. This is useful for external parties who only want to interact with Event Store once the node is ready to do so.

## Event Store UI 3.5.0 release notes

- [#108](https://github.com/EventStore/EventStore.UI/pull/108) Show scavenges in the UI.
- [#111](https://github.com/EventStore/EventStore.UI/pull/111) Show TCP stats in the UI.
- [#113](https://github.com/EventStore/EventStore.UI/pull/113) Shows stats about replicas in a cluster.
- [#114](https://github.com/EventStore/EventStore.UI/pull/114) Adding seconds on the Created Date and Timestamp columns.
- [#116](https://github.com/EventStore/EventStore.UI/pull/116) Redirect the user if they try to access projections when they’re disabled.

## .NET Embedded Client 3.5.0 release notes

- [#807](https://github.com/EventStore/EventStore/pull/807) **(All Platforms)** Embedded Client will now correctly set stats on public. Was previously setting admin on public.
- [#798](https://github.com/EventStore/EventStore/pull/798) **(All Platforms)** Fixing Occasional Race Condition With Authentication.