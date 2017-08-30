---
title: "Event Store 4.0.2 Release Candidate 1"
author: "Hayley Campbell"
layout: blog-post
---

The first release candidate for Event Store 4.0.2 is now available! It is available for the following operating systems:

- Windows (via Chocolatey)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

Our focus has remained on projections following them becoming a supported feature in Event Store. This release includes numerous fixes and performance improvements for projections.

## Event Store Server 4.0.2 RC 1 release notes
## Event Store Server

- [#1265](https://github.com/EventStore/EventStore/pull/1265) - **(All Platforms)** - Add functionality to parse Dictionaries via Rags
- [#1277](https://github.com/EventStore/EventStore/pull/1277) - **(All Platforms)** - Correctly convert the subscription confirmations
- [#1280](https://github.com/EventStore/EventStore/pull/1280) - **(All Platforms)** - Revert to legacy queued handler.
- [#1282](https://github.com/EventStore/EventStore/pull/1282) - **(Mono)** - Reduce CPU usage of idling Event Store on mono
- [#1287](https://github.com/EventStore/EventStore/pull/1287) - **(All Platforms)** - Improve GetHashCode
- [#1336](https://github.com/EventStore/EventStore/pull/1336) - **(All Platforms)** - Remove unnecessary logging filling up client's log files
- [#1369](https://github.com/EventStore/EventStore/pull/1369) - **(All Platforms)** - Limit pending send bytes and drop messages to closed connections
- [#1298](https://github.com/EventStore/EventStore/pull/1298) - **(All Platforms)** - Remove PAdmin in favor of the ES CLI

## Event Store Server - Projections

- [#1272](https://github.com/EventStore/EventStore/pull/1272), [#1312](https://github.com/EventStore/EventStore/pull/1312) - **(All Platforms)** - Disallow the deletion of System Projections
- [#1273](https://github.com/EventStore/EventStore/pull/1273) - **(All Platforms)** - Support any valid json as partition state
- [#1279](https://github.com/EventStore/EventStore/pull/1279) - **(All Platforms)** - Handle all messages in queue even if a consumer throws an error
- [#1281](https://github.com/EventStore/EventStore/pull/1281) - **(All Platforms)** - Partition should handle empty string as simple state
- [#1299](https://github.com/EventStore/EventStore/pull/1299) - **(All Platforms)** - Safe guard collection causing "Collection was modified when running projections" errors
- [#1303](https://github.com/EventStore/EventStore/pull/1303) - **(All Platforms)** - Fix cases where projections are just buffering
- [#1305](https://github.com/EventStore/EventStore/pull/1305) - **(All Platforms)** - Projection Processing Phase can be null
- [#1307](https://github.com/EventStore/EventStore/pull/1307) - **(All Platforms)** - Add additional logging for failure conditions
- [#1309](https://github.com/EventStore/EventStore/pull/1309) - **(All Platforms)** - Improve multi stream reader feedback loop
- [#1314](https://github.com/EventStore/EventStore/pull/1314) - **(Windows)** - Fix projection compilation timeout on Windows
- [#1325](https://github.com/EventStore/EventStore/pull/1325) - **(All Platforms)** - Change how registered projections are read to prevent deleted projections coming back to life
- [#1326](https://github.com/EventStore/EventStore/pull/1326) - **(All Platforms)** - Add 'fromCategories' helper
- [#1338](https://github.com/EventStore/EventStore/pull/1338) - **(All Platforms)** - Checkpoint after a certain period
- [#1346](https://github.com/EventStore/EventStore/pull/1346) - **(All Platforms)** - Time out reads in the ProjectionManagerResponseReader
- [#1351](https://github.com/EventStore/EventStore/pull/1351) - **(All Platforms)** - Dont allow the checkpoint to be enabled for a one time projection as
- [#1357](https://github.com/EventStore/EventStore/pull/1357), [#1356](https://github.com/EventStore/EventStore/pull/1356), [#1360](https://github.com/EventStore/EventStore/pull/1360) - **(All Platforms)** - Make use of the idempotency checks when attempting rewrites
- [#1359](https://github.com/EventStore/EventStore/pull/1359) - **(All Platforms)** - Replace strings with constants
- [#1368](https://github.com/EventStore/EventStore/pull/1368) - **(All Platforms)** - Handle read timeouts during projection recovery
- [#1370](https://github.com/EventStore/EventStore/pull/1370) - **(All Platforms)** - Fix projections getting stuck in preparing when a node becomes master
- [#1373](https://github.com/EventStore/EventStore/pull/1373) - **(All Platforms)** - Limit the number of inflight writes per projection to 1
- [#1374](https://github.com/EventStore/EventStore/pull/1374) - **(All Platforms)** - Expose config options for projections

## Event Store Server - Persistent Subscriptions

- [#1302](https://github.com/EventStore/EventStore/pull/1302) - **(All Platforms)** - Fix checkpoint bug where events could be skipped

## Event Store UI

- (https://github.com/EventStore/EventStore.UI/pull/154) - Allow read/update of projection config

## Embedded client

 - [#1266](https://github.com/EventStore/EventStore/pull/1266) - **(All Platforms)** - Fix acking for embedded persistent subscriptions

## .NET Client

- [#1285](https://github.com/EventStore/EventStore/pull/1285) - **(All Platforms)** - Allow use name of catch-up subscription in connection verbose logging
- [#1262](https://github.com/EventStore/EventStore/pull/1262) - **(All Platforms)** - Add client API for executing queries and awaiting results
- [#1310](https://github.com/EventStore/EventStore/pull/1310), [#1323](https://github.com/EventStore/EventStore/pull/1323) - **(All Platforms)** - Support async OnEventAppeared for subscriptions
- [#1365](https://github.com/EventStore/EventStore/pull/1365) - **(All Platforms)** - Fix memory leak in ReadEventsInternalAsync for subscriptions

## Where can I get the release candidate 1 packages?

The alpha packages can be installed using the following instructions.

**Ubuntu 14.04/16.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS-PreRelease))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS-PreRelease/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=4.0.2-rc1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/4.0.2-rc1))

```
choco install eventstore-oss -version 4.0.2-rc1 -pre
```

**Client Packages** (via [Nuget](https://www.nuget.org/packages/EventStore.Client/4.0.2-rc1))

```
Install-Package EventStore.Client -Pre
```

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
