---
title: "Event Store 5.0.0 Release Candidate 1"
author: "Shaan Nobee"
layout: blog-post
---

Event Store 5.0.0 RC 1 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04
- macOS 10.9+
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

It's been a few months since our last release of EventStore as we've invested time in increasing the stability of the server, providing higher quality builds and improving our user / developer experience.

There are some significant breaking changes (listed below), so we have decided to bump up the version to 5. We will still continue to support v4 but only bug fixes will be backported. EventStore's policy is to support the two latest major versions. Thus, we will stop supporting v3 once v5 is released.

**On another note, the EventStore team wishes you and your family a Merry Christmas and Happy New Year!**

## Highlights

- The [EventStore Client API](https://www.nuget.org/packages/EventStore.Client/) now also targets the `netstandard2.0` framework. This means that the client can now be consumed by both .NET Core 2.0+ projects and .NET Framework 4.6+ projects. We previously had a separate [.NET Core client](https://www.nuget.org/packages/EventStore.ClientAPI.NetCore/)

- Google's V8 has been upgraded to version 7.0 from version 5.2. EventStore's projection library uses the V8 engine to execute Javascript code. This upgrade brings several performance optimizations to projections and the latest Javascript language features. Please consult [V8's blog](https://v8.dev/blog/) for the full list of changes.

- Mono has been upgraded to 5.16.0.220 from version 4.6.2. This upgrade brings more stability to Linux builds as well as new features such as TLS 1.2 support. Please consult the [mono release notes](https://www.mono-project.com/docs/about-mono/releases/) for the full list of changes.

- We are releasing macOS packages again. A tarball package is currently available for download. A `.pkg` installer and a homebrew tap are also on their way to the next RC!

- The [EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client.Embedded/) now works on all platforms: Windows, Linux and Mac. It was previously limited to Windows only. Linux and Mac require an installation of mono 5.16.0.220.

- Please see the Changelog for Enhancements and Bug fixes. More enhancements such as structured logging and correlation/causation ID visualization (commercial only) will be available in the next RCs!

## Breaking Changes
- Windows: .NET Framework must be upgraded to 4.7.1 or later.
- Linux: Users of the "without mono" packages must upgrade mono to version 5.16.0.220. This does not apply to users of the "with mono", .deb and .rpm packages where the mono runtime is statically linked.
- The Embedded Client must now be consumed by .NET Framework v4.7.1+ projects (`net471`) instead of .NET Framework v4.6+ projects (`net46`).
- `EventStore.ClientAPI.StreamCheckpoint.StreamStart` has been changed to a `long?` instead of an `int?`

## Event Store 5.0.0 RC 1 Changelog

### New Features
* [#1622](https://github.com/EventStore/EventStore/pull/1622) - **(Projections)** Addition of a new system projection: `$by_correlation_id`  
All events having a `$correlationId` property (configurable in the projection source) will be emitted to a stream named `$bc-<correlation id>`

**Special thanks from the EventStore team to two open source contributors: Laurence Pike ([@lscpike](https://github.com/lscpike)) and James Connor ([@megakid](https://github.com/megakid)) who contributed all of the following awesome features:**

* [#1756](https://github.com/EventStore/EventStore/pull/1756) - **(Performance)** Faster node initialization  
A new config option has been added: `InitializationThreads` to specify number of threads used to load chunk and index files. This can have a significant impact on startup times.
* [#1639](https://github.com/EventStore/EventStore/pull/1639) - **(Performance/Windows)** Add option to reduce pressure on the system file cache  
A new config option has been added: `ReduceFileCachePressure` that disables the `FileOptions.RandomAccess` cache flag when opening chunk files. This is particularly worth a try if the Windows File Cache is holding up a huge amount of memory.
* [#1632,1633](https://github.com/EventStore/EventStore/pull/1633) - **(Scavenging)** Add ability to interrupt a scavenge by doing an HTTP DELETE request to `/admin/scavenge/{scavengeId}`.
* [#1636](https://github.com/EventStore/EventStore/pull/1636) - **(Scavenging)** Add ability to start a scavenge from a chunk number by doing an HTTP POST request to `/admin/scavenge?startFromChunk=chunkNumber`.
* [#1638](https://github.com/EventStore/EventStore/pull/1638) - **(Scavenging)** Add a scavenge operation to the index (PTables) which is launched automatically after chunk files have been scavenged.
* [#1623](https://github.com/EventStore/EventStore/pull/1623) - **(Persistent Subscriptions)** Add a `PersistentSubscriptionsManager` class to the Client API. This wrapper around the HTTP API allows a developer to easily control persistent subscriptions.


### Bug Fixes / Enhancements
* [#1791](https://github.com/EventStore/EventStore/pull/1791) - **(Client API)** Change type of `EventStore.ClientAPI.StreamCheckpoint.StreamStart` to a `long?` instead of an `int?` (thanks to [@sjmelia](https://github.com/sjmelia)!)
* [#1742](https://github.com/EventStore/EventStore/pull/1742) - **(Scavenging)** Dispose chunk before attempting deletion if an error occurs during scavenging
* [#1728](https://github.com/EventStore/EventStore/pull/1728) - **(Client API)** Give the correct reason when the subscription drops due to overflow: `SubscriptionDropReason.ProcessingQueueOverflow` instead of `SubscriptionDropReason.UserInitiated` (thanks to [@alexeyzimarev](https://github.com/alexeyzimarev)!)
* [#1712](https://github.com/EventStore/EventStore/pull/1712) - **(Persistent Subscriptions)** Added max count to $PersistentSubscriptionConfig to limit the size of the stream. The stream size was previously unbounded.
* [#1692](https://github.com/EventStore/EventStore/pull/1692) - **(Server)** Print which process is locking a file at critical places (Windows only, with admin privileges)
* [#1688](https://github.com/EventStore/EventStore/pull/1688) - **(Performance)** Batch log read expired messages when a high number of reads are expiring
* [#1681](https://github.com/EventStore/EventStore/pull/1681) - **(Projections)** Add missing Reset method to ProjectionsManager and ProjectionsClient (thanks to [@BredStik](https://github.com/BredStik)!)
* [#1667](https://github.com/EventStore/EventStore/pull/1667) - **(Server)** Fix issue where promoting a user to administrator required a server restart before taking effect
* [#1653](https://github.com/EventStore/EventStore/pull/1653) - **(Server)** Fix off by one bug in TFChunkDB causing pre-last chunk file not to be verified
* [#1644](https://github.com/EventStore/EventStore/pull/1644) - **(Server/Projections)** Fix bug in MakeUrl() where url is wrongly formed when query parameters are present. This would cause the UI to throw an error when opening the `Query` tab.
* [#1640](https://github.com/EventStore/EventStore/pull/1640) - **(Performance)** Fix latency in index committer service queue & off by one in _serviceShutdownsToExpect

### Miscellaenous
* [#1643](https://github.com/EventStore/EventStore/pull/1643) - **(Persistent Subscription)** Clean up persistent subscription logging (thanks to [@lscpike](https://github.com/lscpike)!)
* [#1629](https://github.com/EventStore/EventStore/pull/1629) - **(Scavenging)** Clean up scavenge log (thanks to [@lscpike](https://github.com/lscpike)!)

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/) in the "Pre-Release" section.

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS-PreRelease))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS-PreRelease/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=5.0.0-rc1-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/5.0.0-rc1))

```
choco install eventstore-oss -version 5.0.0-rc1 -pre
```

**Client Packages**  

[EventStore Client](https://www.nuget.org/packages/EventStore.Client/5.0.0-rc1)
```
Install-Package EventStore.Client -Pre
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client/5.0.0-rc1)

```
Install-Package EventStore.Client.Embedded -Pre
```

## Internal Improvements
The following internal aspects of EventStore have been improved:
- Several bugs have been fixed for better test stability.
- As part of the effort to migrate the EventStore server to .NET Core, the first step has been to convert the project format to the new SDK format. The server now targets .NET Framework 4.7.1. This also enables us to use the .NET Core tooling which improves accessibility for open source contributors.
- OS detection is now done at runtime so that the same assemblies can be used on any platform.
- On Linux, the projections shared library (libjs1.so) is now compiled only on the distribution having the earliest glibc (in our case CentOS 7 having glibc 2.17). This makes the library compatible with other linux distributions we use and thus allows us to simplify our build process and improves accessibility for open source contributors.
- We have switched our Continuous Integration platform to Azure Pipelines to be able to handle all platforms in a single place and streamline our builds.
- Our downloads page now contains a pre-release section.

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).