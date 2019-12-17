---
title: "Event Store 3.2.0 Released"
author: "James Nugent"
layout: blog-post
category: 'Release Notes'
---

Event Store 3.2.0 is now released! The headline feature is support for the “competing consumers” messaging pattern with *Persistent Subscriptions*, but there have been numerous other improvements.

This follows hot on the heels of 3.1.0, which was quietly released a little over three weeks ago, and adds many features, some of which had been on the `dev` branch (more posts on that over the next week) for a while.

This is the first upgrade released primarily via our package repository for Ubuntu 14.04. This means that to upgrade, assuming you are tracking the `main` component of the repository, a simple `apt-get update && apt-get install --only-upgrade eventstore-oss` should upgrade you. If you have the version component pinned, you can move it to the `§.2.0` component and upgrade in the same manner.

There is also an accompanying update to the .NET Client API and the Embedded Client. These are now in the NuGet gallery.

The release notes for 3.2.0 are listed below, along with the release notes for 3.1.0 for completeness (they were posted on the GitHub release but never on this blog).

## Event Store Server 3.2.0 release notes

- [#599](https://github.com/EventStore/EventStore/pull/599) **(All Platforms)** Event streams now support the competing consumer pattern. This is known as “persistent subscriptions,” for which subscription state is stored server side. This provides at-least-once guarantees. Currently this is supported over TCP only.
- [#646](https://github.com/EventStore/EventStore/pull/646) **(All Platforms)** HTTP Prefixes are no longer automatically added when an interface address is specified as `0.0.0.0` and `--add-interface-prefixes` is set to `false`.
- [#612](https://github.com/EventStore/EventStore/pull/612) **(All Platforms)** Several types of operation now present metrics as histograms in order to help diagnose performance issues in some environments (for example, the percentiles for latency of the storage writer can now be determined). These are enabled with `--enable-histograms`, and are disabled by default.
- [#653](https://github.com/EventStore/EventStore/pull/653) **(All Platforms)** Fixed a bug which could cause events not yet acknowledged by a majority of nodes in a cluster to be returned when reading from the `$all` stream.
- [#623](https://github.com/EventStore/EventStore/pull/623) **(All Platforms)** Index cache depth can now be specified. This can significantly improve performance when working with large databases.
- [#630](https://github.com/EventStore/EventStore/pull/630) **(All Platforms)** A new statistic, `proc_cpuScaled` has been introduced, which is scaled by the number of logical processors.
- [#616](https://github.com/EventStore/EventStore/pull/616) **(All Platforms)** HTTP redirects now respect event numbers instead of redirecting to the head of a stream.
- [#619](https://github.com/EventStore/EventStore/pull/619) **(All Platforms)** A new `NotReady` response to client API requests which are received before the server is ready (e.g. authentication set up) is used.
- [#602](https://github.com/EventStore/EventStore/pull/602) **(All Platforms)** Shutdown requests issued over HTTP now succeed.
- [#642](https://github.com/EventStore/EventStore/pull/642) **(All Platforms)** Response sizes are now bounded to the maximum TCP package size.
- [#643](https://github.com/EventStore/EventStore/pull/643) **(All Platforms)** Requests now expire correctly rather than processing during queue build up.
- [#590](https://github.com/EventStore/EventStore/pull/590) **(Liunx and macOS)** The use of locking concurrent connections on Mono has been removed, resulting in a 15-20% performance increase when running on Linux.
- [#604](https://github.com/EventStore/EventStore/pull/604) **(All Platforms)** The use of SpinLocks has been removed.
- [#601](https://github.com/EventStore/EventStore/pull/601) **(macOS)** Memory statistics now work correctly on macOS.
- [#635](https://github.com/EventStore/EventStore/pull/635) **(All Platforms)** Several occurrences of poor English grammar in exception and log messages have been rectified.
- Config **(All Platforms)** The `/info` endpoint now reports the correct version number.
- [#582](https://github.com/EventStore/EventStore/pull/582) **(All Platforms)** Windows packages now have the correct ordering of filename components.
- [#583](https://github.com/EventStore/EventStore/pull/583) **(macOS)** macOS packaging scripts are now compatible with BSD `sed` as well as GNU `sed`.

## .NET Client API 3.2.0 release notes

- [#585](https://github.com/EventStore/EventStore/pull/585) **(All Platforms)** Connection strings are now used to specify options for the .NET Client API. The older builder methods will be deprecated in the next release.
- [#586](https://github.com/EventStore/EventStore/pull/586) **(All Platforms)** Several types which did not form part of the public contract are now marked as internal.
- [#603](https://github.com/EventStore/EventStore/pull/603) **(All Platforms)** `ProjectionManager` now exposes the HTTP response status code.
- [#608](https://github.com/EventStore/EventStore/pull/608) **(All Platforms)** Users can now be created, edited and deleted via the Client API.
- [#610](https://github.com/EventStore/EventStore/pull/610) **(All Platforms)** Requests are now subject to a limit of 4096 items.
- [#622](https://github.com/EventStore/EventStore/pull/622) **(All Platforms)** A better error message is now present in the case that a message size is too large to fit in a frame.
- [#645](https://github.com/EventStore/EventStore/pull/645) **(All Platforms)** An `InvalidOperationException` which could occur when running the Client API on Mono is now caught and treated in the same manner as bad connect. This looks to be a Mono regression in 4.0.
- [#586](https://github.com/EventStore/EventStore/pull/586) **(All Platforms)** A new type hierarchy now exists for subscriptions in order to allow support for Persistent subscriptions (competing consumers).

## .NET Embedded Client 3.2.0 release notes

- [#589](https://github.com/EventStore/EventStore/pull/589) **(All Platforms)** Authentication is now supported in the Embedded Client.







## Event Store Server 3.1.0 release notes

- [#553](https://github.com/EventStore/EventStore/pull/553) **(Linux)** The primary distribution mechanism for EventStore is now via Debian packages. Consequently data, log and content directories now have more sensible platform defaults. This structure is created when the Debian packages are installed. On Linux, the defaults are now:
    - `/var/lib/eventstore`: default database path
    - `/var/log/eventstore`: default log file path
    - `/etc/eventstore`: default configuration file path
    - `/usr/share/eventstore`: default content (e.g. Web UI) directory.
- 84ef2ef **(Linux and macOS)** the binary distribution with Mono statically linked has had the executable `clusternode` renamed to `eventstored` to more accurately describe itself in `ps` listings.
- [#589](https://github.com/EventStore/EventStore/pull/454)/[#477](https://github.com/EventStore/EventStore/pull/477) **(All Platforms)** the English in exception and log messages has had spelling and grammatical errors corrected.
- f3513b1 **(All Platforms)** the new `--development-mode` flag forces the responses to HTTP requests that would normally be cacheable to include the header `Cache-Control: max-age=0, no-cache, must-revalidate`. This is often useful when running on local development machines.
- 2827c61 **(Linux and macOS)** The Mono thread pool size is automatically set to 10 by default on machines with a single CPU. This fixes [#296](https://github.com/EventStore/EventStore/pull/296).
- d5e9064 **(All Platforms)** The options parser has been changed from PowerArgs to a custom parser. This fixes a number of issues including [#272](https://github.com/EventStore/EventStore/pull/272), and improves the display of modified options and their sources.
- a971d18 **(All Platforms)** A user account which has been previously deleted can now be re-created. It will inherit the permissions granted to the old account of the same name.
- [#529](https://github.com/EventStore/EventStore/pull/529) **(All Platforms)** When forwarding requests amongst nodes over HTTP, the `X-Forwarded-Host` header is sent along with the forwarded request.
- [#537](https://github.com/EventStore/EventStore/pull/537) **(All Platforms)** The state of each cluster node (`master`, `slave` or `clone`) is now available on the `/info` endpoint of each node.
- 030fe30 **(All Platforms)** Event metadata is now included in the `vnd.eventstore.events+json` media type when the `embed` parameter is set to `body`.
- 6a1655c **(All Platforms)** Event ID is now included in the `vnd.eventstore.events+json` media type.
- 8550801 **(All Platforms)** HTTP Prefixes can now be set independently for the internal and external network interface services.
- c5900b7 **(All Platforms)** Creating a user with the same password as the one which already exists now returns `201 Created` else it returns `409 Conflict`.
- [#556](https://github.com/EventStore/EventStore/pull/556) **(All Platforms)** Allow cluster nodes to advertise themselves as being at a different address than the one which they are bound to. This is useful when running behind a NAT server, or if a node is bound to all interfaces (0.0.0.0).
- [#569](https://github.com/EventStore/EventStore/pull/569) **(All Platforms)** PTables are now disposed correctly in all cases. This can reduce the frequency with which index rebuilds occur.
- b34677e **(Linux and macOS)** Better default garbage collector settings are chosen by default for the versions of Event Store with Mono statically linked, because of an upstream bug in Mono.

## Event Store UI 3.1.0 release notes

- EventStore/EventStore.UI#66 **(All Platforms)** Bug fix with poller incorrectly being created (Polling).
- EventStore/EventStore.UI@cd9ffe3 **(All Platforms)** Fix misspelt variable that was causing the state not to be displayed (Projections).
- EventStore/EventStore.UI#69 **(All Platforms)** - Fixed a series of bugs related to the poller (Polling).
- EventStore/EventStore.UI@ff0110b **(All Platforms)** Fixed styling inconsistency (Enable Users).
- EventStore/EventStore.UI@8b092e2 **(All Platforms)** Fixed deletion of user (Users).
- EventStore/EventStore.UI@fff6c07 **(All Platforms)** Ensure styling consistency in notifications. Success when enabling user (Users).

## Event Store Server (Projections) 3.1.0 release notes

- [#349](https://github.com/EventStore/EventStore/pull/349) **(All Platforms)** User management no longer makes use of projections. *Consequently the default mode for projections has been changed to `None`, rather than `System`*.
- [#517](https://github.com/EventStore/EventStore/pull/517) **(All Platforms)** Projections now use a soft delete by default, which means it is possible to recreate them.
- [#503](https://github.com/EventStore/EventStore/pull/503) **(All Platforms)** Projection administration HTTP requests are now idempotent.
- d1f261f **(All Platforms)** libjs1 (used for projections) is now const correct and compiles without warning on modern C++ compilers.
- a147274 **(Linux and macOS)** libv8 and its dependencies are now statically linked into libjs1 in order to prevent conflicts with other programs which install libv8.

## Embedded .NET Client 3.1.0 release notes

- 84ef2ef **(All Platforms)** The embedded client API is now tolerant of missing assemblies, which may occur during the assembly scan for types derived from `Message` during startup.