---
title: "Event Store 5.0.0 Release Candidate 2"
author: "Shaan Nobee"
layout: blog-post
category: 'Release Notes'
---

Event Store 5.0.0 RC 2 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04
- macOS 10.9+
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

This release candidate contains all the [changes in 5.0.0 RC 1](https://eventstore.org/blog/20181226/event-store-5.0.0-release-candidate-1/) plus the following changes.

## Event Store 5.0.0 RC 2 Changelog

### New Features
* [#1678](https://github.com/EventStore/EventStore/pull/1678) - **(Server)** Structured Logging  
By adding `StructuredLog: True` to your config or launching EventStore with `--structured-log`, your logs and stats files will magically turn into JSON which can easily be ingested into your log aggregation platform for analysis. Each line written to the logs/stats file is a serialized JSON string.
* **[Commercial]** Correlation/Causation ID visualization  
This feature allows you to visualize event flows if you use the correlation/causation ID pattern. The `$by_correlation_id` projection must be turned on for this feature to work. To access this feature, you can go to the "Visualize" tab in the web UI menu.
* [#1813](https://github.com/EventStore/EventStore/pull/1813) - **(Server)** Referenced Environment Variables (thanks to [@hanxinimm](https://github.com/hanxinimm)!)  
EventStore has for a long time supported setting configuration parameters through Environment Variables. For example, setting the environment variable `EVENTSTORE_EXT_IP=172.16.12.34` when launching the node is equivalent to adding `ExtIP: 172.16.12.34` to your config file.  
With this change, you can now reference another environment variable by setting the value to `${env:REFERENCED_ENV_VAR}`. For instance, if you're on [Azure Service Fabric](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-overview) some [predefined environment variables](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-environment-variables-reference) exist. You could thus set `EVENTSTORE_EXT_IP=${env:Fabric_NodeIPOrFQDN}` to easily reference the node's IP address.
* **[Packaging]** A `.pkg` installer is now available for macOS in the downloads section of our website.
* **[Packaging]** The EventStore test client is now bundled in deb and rpm packages as `estestclient`
* **[Commercial/Windows]** Allow the EventStore Manager service to be installed or uninstalled in non-interactive mode. This is useful for unattended installation of EventStore through a powershell script.

### Bug Fixes / Enhancements
* [#1737](https://github.com/EventStore/EventStore/pull/1737) - **(Server)** Fixed `ObjectPoolMaxLimitReachedException` for many reader threads (thanks to [@MadKat13](https://github.com/MadKat13)!)  
When `--reader-threads-count` is increased, the object pool size was not scaled up accordingly. The following error would be thrown during high read load:
`Object pool 'ReadIndex readers pool' has reached its max limit for items: 14.`
* [#1774](https://github.com/EventStore/EventStore/pull/1774) - **(Projections)** Add a `FaultOutOfOrderProjections` option (default: `True`) to allow the user to specify if a projection should be faulted when there is a discontinuity in event ordering. For example, if a stream has a `$maxAge` or `$maxCount`, a projection processing this stream may not receive some events if they have already "expired". In case `FaultOutOfOrderProjections` is set to `False`, an error will simply be logged and the projection will continue processing events.
* [#1769](https://github.com/EventStore/EventStore/pull/1769) - **(Client API)** Fix issue where `FailOnNoServerResponse()` combined with `KeepReconnecting()` would cause the client to hang indefinitely
* [#1801](https://github.com/EventStore/EventStore/pull/1801) - **(Test Client)** Use `testclient.conf` for the EventStore test client instead of `eventstore.conf`
* [#211](https://github.com/EventStore/EventStore.UI/pull/211) - **(UI)** Fix bug in `ProjectionService.js -> updateQuery()` causing the `source` to be set to `emit` value when an empty string is passed as `source`
* [#1799](https://github.com/EventStore/EventStore/pull/1799) - **(Server)** Fix assembly information for `EventStore.Native` and `EventStore.Rags`
* **[Packaging]** Bundle missing mono shared libraries in native packages: `libmono-btls-shared`, `libmono-system-native`
* **[Packaging/Performance]** Add `--optimize=inline` mono runtime optimization to native packages

### Miscellaneous
* [#210](https://github.com/EventStore/EventStore.UI/pull/210) - **(UI)** Remove bower components from repository
* [#1823](https://github.com/EventStore/EventStore/pull/1823) - **(UI)** Install bower for UI builds
* [#1800](https://github.com/EventStore/EventStore/pull/1800) - **(Server)** Add default file locations for macOS (for system-wide installations)
* [#1796](https://github.com/EventStore/EventStore/pull/1796) - **(API Docs)** Polish ExpectedVersion docs

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/) in the "Pre-Release" section.

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS-PreRelease))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS-PreRelease/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=5.0.0-rc2-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/5.0.0-rc2))

```
choco install eventstore-oss -version 5.0.0-rc2 -pre
```

**Client Packages**  

[EventStore Client](https://www.nuget.org/packages/EventStore.Client/5.0.0-rc2)
```
Install-Package EventStore.Client -Pre
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client/5.0.0-rc2)

```
Install-Package EventStore.Client.Embedded -Pre
```

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).