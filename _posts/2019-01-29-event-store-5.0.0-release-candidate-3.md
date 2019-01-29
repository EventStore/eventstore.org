---
title: "Event Store 5.0.0 Release Candidate 3"
author: "Shaan Nobee"
layout: blog-post
---

Event Store 5.0.0 RC 3 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04
- macOS 10.9+
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

This release candidate includes all the changes in [5.0.0 RC 1](https://eventstore.org/blog/20181226/event-store-5.0.0-release-candidate-1/) and [5.0.0 RC 2](https://eventstore.org/blog/20190110/event-store-5.0.0-release-candidate-2/).

## Event Store 5.0.0 RC 3 Changelog

### Breaking Changes
* [#1838](https://github.com/EventStore/EventStore/pull/1838) - **(C# Client)** Deprecated functions have been removed from the code base. Please see the following links for more details:
  * [IEventStoreConnection.SubscribeToStreamFrom() and  IEventStoreConnection.SubscribeToAllFrom()](https://github.com/EventStore/EventStore/commit/cd83cd131f731a7af6b02f9ba263b6053bf7f348)
  * [ProjectionsManager.ListAllAsString(), ProjectionsManager.ListOneTimeAsString() and ProjectionsManager.ListContinuousAsString()](https://github.com/EventStore/EventStore/commit/6c220edaf00e06a36bfdbfe620537db98e26172d)
  * [VNodeBuilder.RunProjections()](https://github.com/EventStore/EventStore/commit/65453a3b4c93276730d13954535bfabf3564300e)

### New Features
* [#1842](https://github.com/EventStore/EventStore/pull/1842) - **(Server)** Add a maximum index level for automatically merging ptables.  
  * A new configuration option named `MaxAutoMergeIndexLevel (int)` has been added which defines the highest PTable level below which PTable index files will be merged automatically (just like it's done by default). Let's denote the maximum merge level you have set in your configuration by `L` to simplify the explanation below.
  * To merge index files that are at the specified level `L`, an endpoint can be manually triggered by doing a `POST` request to `/admin/mergeindexes`. This will merge the index files at level `L` to level `L+1`. Index files that are at level `L+1` or higher will stay the same.
  * This option is useful in situations where large index merges are slowing down writes due to heavy disk usage. With this option, large index files can be merged during off-peak hours.
  *  Once set, the maximum merge level can be decreased in your configuration. However, increasing it in your configuration may require a full index rebuild.

### Bug Fixes / Enhancements
* [#1828](https://github.com/EventStore/EventStore/pull/1828) - **(Server)** Check to avoid crash when network is disconnected.
* [#1839](https://github.com/EventStore/EventStore/pull/1839) - **(Server)** Look for EventStore plugins in `/usr/share/eventstore/plugins` on Linux and `/usr/local/share/eventstore/plugins` on macOS.
* [#1841](https://github.com/EventStore/EventStore/pull/1841) - **(Server)** Fix drive stats for ZFS (total/free space). (thanks to [@ahjohannessen](https://github.com/ahjohannessen)!)  
The following error would previously be visible in the logs:
```
Error while reading drive info for path "/path/to/db". Message: "The drive name does not exist
Parameter name: driveName".
```

### Performance
* [#1829](https://github.com/EventStore/EventStore/pull/1829) - **(Server)** Do not publish `StorageMessage.EventCommitted` messages when rebuilding the index. This speeds up full index rebuilds by a factor of approximately 1.8x and also speeds up node startup time by a few seconds when there are many index entries to rebuild.
* [#1830](https://github.com/EventStore/EventStore/pull/1830) - **(Server)** Set spin count to 1 in `ManualResetEventSlim`. This drastically reduces the CPU usage due to excess spinning on processors with long `PAUSE` cycles, for example: Intel Skylake/Kaby Lake.
* [#1835](https://github.com/EventStore/EventStore/pull/1835) - **(Server/C# Client)** `ConcurrentQueue` workaround to speed up `ConcurrentQueue.Count`.  
This speeds up our queue loops on Linux/macOS where the queue length is required. The `ConcurrentQueue` data structures have changed as from mono 5.2 and .NET Core 2.0 and in some scenarios, `ConcurrentQueue.Count` can be extremely slow.

### Miscellaneous
* [#1826](https://github.com/EventStore/EventStore/pull/1826) - **(Server)** Enable structured logging by default.
* [#1837](https://github.com/EventStore/EventStore/pull/1837) - **(Server)** Make the console logs human-readable even when structured logging is enabled.

### Commercial version
- Fix plugin packaging for Linux and macOS packages.
- UI: fix issue where some Javascript code was not correctly minified due to a bug in `uglify-js 3.4.9`.

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/) in the "Pre-Release" section.

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS-PreRelease))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS-PreRelease/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=5.0.0-rc3-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/5.0.0-rc3))

```
choco install eventstore-oss -version 5.0.0-rc3 -pre
```

**Client Packages**  

[EventStore Client](https://www.nuget.org/packages/EventStore.Client/5.0.0-rc3)
```
Install-Package EventStore.Client -Pre
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client/5.0.0-rc3)

```
Install-Package EventStore.Client.Embedded -Pre
```

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).