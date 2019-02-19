---
title: "Event Store 5.0.0"
author: "Shaan Nobee"
layout: blog-post
---

Event Store 5.0.0 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04
- macOS 10.9+
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

It's been some months since our last stable release of EventStore as we've invested time in increasing the stability of the server, providing higher quality builds and improving our user and developer experience.

There are some significant breaking changes, so we've decided to bump up the version to 5. EventStore's policy is to support the two latest major versions. Thus, as from now on, we will no longer support v3 and will continue to support v4 by providing important bug fixes. We, however, recommend all our users to upgrade to v5 to benefit from all the stability and performance improvements as well as the new features.

## Highlights

- The [EventStore Client API](https://www.nuget.org/packages/EventStore.Client/) now also targets the `netstandard2.0` framework. This means that the client can be consumed by .NET Core 2.0+ projects. We previously had a separate [.NET Core client](https://www.nuget.org/packages/EventStore.ClientAPI.NetCore/). This is the first step in the effort to migrate EventStore towards .NET Core. We are also planning to migrate the server in the near future.

- The [EventStore Client API](https://www.nuget.org/packages/EventStore.Client/) now also targets the `net452` framework. We previously targeted only the `net46` framework.

- Google's V8 has been upgraded to version 7.0 from version 5.2. EventStore's projection library uses the V8 engine to execute Javascript code. This upgrade brings several performance optimizations to projections and the latest Javascript language features. Please consult [V8's blog](https://v8.dev/blog/) for the full list of changes.

- Mono has been upgraded to 5.16.0.220 from version 4.6.2. This upgrade brings more stability to Linux builds as well as new features such as TLS 1.2 support. Please consult the [mono release notes](https://www.mono-project.com/docs/about-mono/releases/) for the full list of changes.

- We are releasing macOS packages again. A `.pkg` installer and tarball package is currently available for download. A Homebrew package is also in progress.

- The [EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client.Embedded/) now works on all platforms: Windows, Linux and macOS. It was previously limited to Windows only. Linux and macOS require an installation of mono 5.16.0.220.

- Many new features, bug fixes and enhancements! Please consult the Changelog for more details.

## Upgrade Procedure
If you're running an EventStore cluster, we recommend you upgrade to version 5.0.0 by doing a rolling upgrade from version 4.1.1-hotfix1 without downtime:
- Stop a node, upgrade it and start it
- It is preferable to start the upgrade with slave nodes first, then upgrade the master last to minimize the number of elections and client reconnections
- Upgrade the clients (optional but recommended)

## Breaking Changes
- **Server/Windows:** .NET Framework must be upgraded to version 4.7.1 or later. This applies to the server only.
- **C# Client:** `EventStore.ClientAPI.StreamCheckpoint.StreamStart` has been changed to a `long?` instead of an `int?`
- **C# Client:** Deprecated functions have been removed from the code base. Please see the following links for more details:
  * [IEventStoreConnection.SubscribeToStreamFrom() and  IEventStoreConnection.SubscribeToAllFrom()](https://github.com/EventStore/EventStore/commit/cd83cd131f731a7af6b02f9ba263b6053bf7f348)
  * [ProjectionsManager.ListAllAsString(), ProjectionsManager.ListOneTimeAsString() and ProjectionsManager.ListContinuousAsString()](https://github.com/EventStore/EventStore/commit/6c220edaf00e06a36bfdbfe620537db98e26172d)
  * [VNodeBuilder.RunProjections()](https://github.com/EventStore/EventStore/commit/65453a3b4c93276730d13954535bfabf3564300e)
- **C# Embedded Client:** The Embedded Client must now be consumed by .NET Framework v4.7.1+ projects (`net471`) instead of .NET Framework v4.6+ projects (`net46`).
- **All Platforms:** With the addition of the `MaxAutoMergeIndexLevel` feature, version 2 of the `indexmap` file format has been introduced. This means that downgrading EventStore from version 5 to 4.x will require a full index rebuild. There is an easy workaround that does not require index rebuilds - please feel free to contact support or open a Github issue if you need help about that.
- **All Platforms:** Structured logging (json) has been introduced and set as the default for logs and stats files. If you prefer the old, plaintext format, you can add `StructuredLog: False` to your config or launch EventStore with `--structured-log=False`. We have tried our best to keep the output similar to 4.x but the format of some lines may have changed.

## Event Store 5.0.0 Changelog

### New Features / Enhancements
* [#1622](https://github.com/EventStore/EventStore/pull/1622) - **(Projections)** Addition of a new system projection: `$by_correlation_id`  
All events having a `$correlationId` property (configurable in the `$by_correlation_id` projection source) will be emitted to a stream called `$bc-<correlation id>`
* [#1678](https://github.com/EventStore/EventStore/pull/1678) - **(Server)** Structured Logging  
By default, EventStore logs and stats will now be saved in the JSON format. Each line written to the logs or stats file is a serialized JSON object. The main benefit of this new feature is that you can easily ingest your logs and stats into your log aggregation or data analysis platform without requiring any grok filter/custom code.
* [#1842](https://github.com/EventStore/EventStore/pull/1842) - **(Server)** Add a maximum index level for automatically merging PTables. This option is useful in situations where large index merges are slowing down writes due to heavy disk usage. With this option, large PTables can be merged during off-peak hours.
  * A new configuration option named `MaxAutoMergeIndexLevel (int)` has been added which defines the highest PTable level up to which PTable index files will be merged automatically. Let's denote the maximum merge level you have set in your configuration by `L` to simplify the explanation below.
  * To merge PTables that have reached the specified level `L`, an endpoint URL can be manually triggered by doing a `POST` request to `/admin/mergeindexes`. This will merge all the PTables at level `L` to level `L+1`. Also, if there are any PTables that are at level `L+2` or higher they will be merged down to level `L+1`.
  * Once set, the maximum merge level can be decreased in your configuration. However, increasing it in your configuration will require a full index rebuild.  
  * For quick reference, default PTable levels are as follows (assuming that you have not changed `MaxMemTableSize` which is `1M` by default):  
    * Level 0 - 1M index entries
    * Level 1 - 2M index entries
    * Level 2 - 4M index entries
    * Level 3 - 8M index entries
    * Level 4 - 16M index entries
    * Level 5 - 32M index entries  
 Depending on your hardware configuration, merges can take several minutes as from this level, you can verify your logs to get a better idea of the amount of time taken.
    * Level 6 - 64M index entries  
    * Level 7 - 128M index entries  
    * Level 8 - 256M index entries  
    ...
    * Level K - 2^K x 1M index entries
* [#1774](https://github.com/EventStore/EventStore/pull/1774) - **(Projections)** Add a `FaultOutOfOrderProjections` option (default: `True`) to allow the user to specify if a projection should be faulted when there is a discontinuity in event ordering. For example, if a stream has a `$maxAge` or `$maxCount`, a projection processing this stream may not receive some events if they have already "expired". In case `FaultOutOfOrderProjections` is set to `False`, an error is logged and the projection will continue processing events.
* [#1692](https://github.com/EventStore/EventStore/pull/1692) - **(Server)** Print which process is locking a file at critical places (Windows only, with admin privileges)
* **[Commercial]** Correlation/Causation ID visualization  
This feature allows you to visualize event flows if you use the correlation/causation ID pattern. The `$by_correlation_id` projection must be turned on for this feature to work. To access this feature, you can go to the `Visualize` tab in the Web UI menu.
[View screenshot](/images/visualize-correlation-causation.jpg)

* **[Commercial/Windows]** Allow the EventStore Manager service to be installed or uninstalled in non-interactive mode. This is useful for unattended installation of EventStore through a powershell script.
* **[Packaging]** The EventStore test client is now bundled in deb and rpm packages as `estestclient`

### Community-Contributed Features / Enhancements

* [#1813](https://github.com/EventStore/EventStore/pull/1813) - **(Server)** Referenced Environment Variables (thanks to [@hanxinimm](https://github.com/hanxinimm)!)  
EventStore has for a long time supported setting configuration parameters through Environment Variables. For example, setting the environment variable `EVENTSTORE_EXT_IP=172.16.12.34` when launching the node is equivalent to adding `ExtIP: 172.16.12.34` to your config file.  
With this change, you can now reference another environment variable by setting the variable's value to `${env:REFERENCED_ENV_VAR}`. For instance, if you're on [Azure Service Fabric](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-overview) some [predefined environment variables](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-environment-variables-reference) exist. You could thus set `EVENTSTORE_EXT_IP=${env:Fabric_NodeIPOrFQDN}` to easily reference the node's IP address.
* [#1791](https://github.com/EventStore/EventStore/pull/1791) - **(C# Client)** Change type of `EventStore.ClientAPI.StreamCheckpoint.StreamStart` to a `long?` instead of an `int?` (thanks to [@sjmelia](https://github.com/sjmelia)!)
* [#1728](https://github.com/EventStore/EventStore/pull/1728) - **(C# Client)** Give the correct reason when the subscription drops due to overflow: `SubscriptionDropReason.ProcessingQueueOverflow` instead of `SubscriptionDropReason.UserInitiated` (thanks to [@alexeyzimarev](https://github.com/alexeyzimarev)!)
* [#1681](https://github.com/EventStore/EventStore/pull/1681) - **(C# Client/Projections)** Add missing Reset method to `ProjectionsManager` and `ProjectionsClient` (thanks to [@BredStik](https://github.com/BredStik)!)

**Special thanks from the EventStore team to two open source contributors: Laurence Pike ([@lscpike](https://github.com/lscpike)) and James Connor ([@megakid](https://github.com/megakid)) who contributed all of the following awesome features:**

* [#1756](https://github.com/EventStore/EventStore/pull/1756) - **(Performance)** Faster node initialization  
A new config option has been added: `InitializationThreads` to specify number of threads used to load chunk and index files. This can have a significant impact on startup times.
* [#1639](https://github.com/EventStore/EventStore/pull/1639) - **(Performance/Windows)** Add option to reduce pressure on the system file cache  
A new config option has been added: `ReduceFileCachePressure` that disables the `FileOptions.RandomAccess` cache flag when opening chunk files. This is particularly worth trying if the Windows File Cache is holding up a huge amount of memory.
* [#1632,1633](https://github.com/EventStore/EventStore/pull/1633) - **(Scavenging)** Add ability to interrupt a scavenge by doing an HTTP DELETE request to `/admin/scavenge/{scavengeId}`.
* [#1636](https://github.com/EventStore/EventStore/pull/1636) - **(Scavenging)** Add ability to start a scavenge from a chunk number by doing an HTTP POST request to `/admin/scavenge?startFromChunk=chunkNumber`.
* [#1637,1638](https://github.com/EventStore/EventStore/pull/1638) - **(Scavenging/Performance)** Faster scavenges (up to ~10x speedup!) and Add a scavenge operation to the index (PTables) which is launched automatically after chunk files have been scavenged. This PR also allows the user to specify the number of threads used for a DB scavenge by doing an HTTP POST request to `/admin/scavenge?startFromChunk=chunkNumber&threads=numThreads`
* [#1623](https://github.com/EventStore/EventStore/pull/1623) - **(C# Client/Persistent Subscriptions)** Add a `PersistentSubscriptionsManager` class to the Client API. This wrapper around the HTTP API allows a developer to easily control persistent subscriptions.

### Bug Fixes
* [#1769](https://github.com/EventStore/EventStore/pull/1769) - **(C# Client)** Fix issue where `FailOnNoServerResponse()` combined with `KeepReconnecting()` would cause the client to hang indefinitely
* [#1867](https://github.com/EventStore/EventStore/pull/1867) - **(C# Client)** Fixes CheckTimeoutsAndRetry to be able to work if the connection is null  
This change fixes an important bug discovered in version 5.0.0 of `EventStore.Client` shortly after release of EventStore v5 which causes the client not to be able to reconnect to the server if the TCP connection was closed on the client side (for instance, due to a client-side heartbeat timeout). This bug has been fixed in version 5.0.1 of the client and version 5.0.0 has been unlisted from nuget.org due to the severity of this bug.
* [#1653](https://github.com/EventStore/EventStore/pull/1653) - **(Server)** Fix off by one bug in TFChunkDB causing pre-last chunk file not to be verified
* [#1737](https://github.com/EventStore/EventStore/pull/1737) - **(Server)** Fixed `ObjectPoolMaxLimitReachedException` for many reader threads (thanks to [@MadKat13](https://github.com/MadKat13)!)  
When `--reader-threads-count` is increased, the object pool size was not scaled up accordingly. The following error would be thrown during high read load:
`Object pool 'ReadIndex readers pool' has reached its max limit for items: 14.`
* [#1841](https://github.com/EventStore/EventStore/pull/1841) - **(Server)** Fix drive stats for ZFS filesystems (total/free space). (thanks to [@ahjohannessen](https://github.com/ahjohannessen)!)  
The following error would previously be visible in the logs:
```
Error while reading drive info for path "/path/to/db". Message: "The drive name does not exist
Parameter name: driveName".
```
* [#1742](https://github.com/EventStore/EventStore/pull/1742) - **(Server)** Dispose chunk before attempting deletion if an error occurs during scavenging
* [#1667](https://github.com/EventStore/EventStore/pull/1667) - **(Server)** Fix issue where promoting a user to administrator required a server restart before taking effect
* [#1644](https://github.com/EventStore/EventStore/pull/1644) - **(Server)** Fix bug in `MakeUrl()` where url is wrongly formed when query parameters are present. This would cause the UI to throw an error when opening the `Query` tab.
* [#1828](https://github.com/EventStore/EventStore/pull/1828) - **(Server)** Check to avoid crash when network is disconnected.
* [#1712](https://github.com/EventStore/EventStore/pull/1712) - **(Server)** Added max count to `$PersistentSubscriptionConfig` to limit the size of the stream. The stream size was previously unbounded.
* [#1839](https://github.com/EventStore/EventStore/pull/1839) - **(Server)** Look for EventStore plugins in `/usr/share/eventstore/plugins` on Linux and `/usr/local/share/eventstore/plugins` on macOS.
* [#211](https://github.com/EventStore/EventStore.UI/pull/211) - **(UI)** Fix bug in `ProjectionService.js -> updateQuery()` causing the `source` to be set to `emit` value when an empty string is passed as `source`.
* [#1801](https://github.com/EventStore/EventStore/pull/1801) - **(Test Client)** Use `testclient.conf` for the EventStore test client instead of `eventstore.conf`.

### Performance
* [#1756](https://github.com/EventStore/EventStore/pull/1756) - **(Server)** Faster node initialization  
A new config option has been added: `InitializationThreads` to specify number of threads used to load chunk and index files. This can have a significant impact on startup times. (thanks to [@megakid](https://github.com/megakid)!)
* [#1639](https://github.com/EventStore/EventStore/pull/1639) - **(Server/Windows)** Add option to reduce pressure on the system file cache  
A new config option has been added: `ReduceFileCachePressure` that disables the `FileOptions.RandomAccess` cache flag when opening chunk files. This is particularly worth trying if the Windows File Cache is holding up a huge amount of memory. (thanks to [@lscpike](https://github.com/lscpike)!)
* [#1637,1638](https://github.com/EventStore/EventStore/pull/1638) - **(Scavenging/Performance)** Faster scavenges (up to ~10x speedup!) (thanks to [@lscpike](https://github.com/lscpike) and [@megakid](https://github.com/megakid)!)
* [#1640](https://github.com/EventStore/EventStore/pull/1640) - **(Server)** Fix latency issue in index committer service queue & off by one error when shutting down EventStore services
* [#1688](https://github.com/EventStore/EventStore/pull/1688) - **(Server)** Batch log read expired messages when a high number of reads are expiring
* [#1829](https://github.com/EventStore/EventStore/pull/1829) - **(Server)** Do not publish `StorageMessage.EventCommitted` messages when rebuilding the index. This speeds up full index rebuilds by a factor of approximately 1.8x and also speeds up node startup time by a few seconds when there are many index entries to rebuild.
* **[Packaging/Performance]** Add `--optimize=inline` mono runtime optimization to native packages

### Miscellaneous
* [#210](https://github.com/EventStore/EventStore.UI/pull/210) - **(UI)** Remove bower components from repository
* [#1823](https://github.com/EventStore/EventStore/pull/1823) - **(UI)** Install bower for UI builds
* [#1796](https://github.com/EventStore/EventStore/pull/1796) - **(API Docs)** Polish ExpectedVersion docs
* [#1800](https://github.com/EventStore/EventStore/pull/1800) - **(Server)** Add default file locations for macOS (for system-wide installations)
* [#1643](https://github.com/EventStore/EventStore/pull/1643) - **(Server)** Clean up persistent subscription logging (thanks to [@lscpike](https://github.com/lscpike)!)
* [#1629](https://github.com/EventStore/EventStore/pull/1629) - **(Server)** Clean up scavenge log (thanks to [@lscpike](https://github.com/lscpike)!)

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/).

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=5.0.0-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/5.0.0-rc1))

```
choco install eventstore-oss -version 5.0.0
```

**Client Packages**  

[EventStore Client](https://www.nuget.org/packages/EventStore.Client/)  
We highly discourage using EventStore.Client version 5.0.0 due to a severe bug mentioned in the bug fixes section. Please use version 5.0.1.
```
dotnet add package EventStore.Client --version 5.0.1
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client.Embedded/)

```
dotnet add package EventStore.Client.Embedded --version 5.0.0
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
