---
title: "Event Store 4.1.1 Release"
author: "Shaan Nobee"
layout: blog-post
---

We are excited to announce that Event Store 4.1.1 has just been released! It is available for the following operating systems:

- Windows (via Chocolatey)
- Ubuntu 18.04 (via packagecloud)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

## Major Bug Fixes

This release comes with two major bug fixes.

### 1.  Overflow bug during PTable construction with --skip-index-verify

**Affected OS:** All OSes

**Necessary Conditions:**
- Run EventStore with **--skip-index-verify** / **SkipIndexVerify: True**. This option is only available as from version 4.1.0.
- An index merge happens resulting in a PTable with more than _Int32.MaxValue (2147483647)_ index entries

**Symptoms:**

The node will exit with an error similar to the following in the logs:

```
ReadIndex is corrupted...
EventStore.Core.Exceptions.CorruptIndexException: Error while loading IndexMap.
EventStore.Core.Exceptions.CorruptIndexException: Item index for midpoint 8856062 (2147483525) > Item index for midpoint 8856063 (-2147483526)
 at EventStore.Core.Index.PTable.CacheMidpointsAndVerifyHash(Int32 depth, Boolean skipIndexVerify)
```

**Impact:**  
- The node will exit with the above exception just after the PTable merge when the new PTable is loaded
- A full rebuild of indexes will occur on the next startup but the same error will be thrown again
- There is no data corruption

There are two options to prevent this error from occuring:
- The node must be upgraded to version 4.1.1
- _SkipIndexVerify_ option must not be enabled

### 2. Handle unauthorised access exceptions when replacing indexmap files
**Affected OS:** Windows only  
**Symptoms:**  
The node will exit with an error similar to the following in the logs:

```
Error in TableIndex.ReadOffQueue
System.UnauthorizedAccessException: Access to the path '\path\to\index\indexmap' is denied.
   at System.IO.__Error.WinIOError(Int32 errorCode, String maybeFullPath)
   at System.IO.File.InternalDelete(String path, Boolean checkHost)
   at EventStore.Core.Index.IndexMap.SaveToFile(String filename)
```

This issue occurs when the _Read-Only_ attribute is set on the _indexmap_ file.

**Impact:**  
- The node will exit with the above exception
- There is no data corruption

## Index Merge Improvements

PTable merges of index entries that map to scavenged chunks in the database are much slower than merging index entries mapping to non-scavenged chunks by a factor of approximately _10x_. The main overhead is due to the time taken to verify if an index entry is still present in the scavenged chunk file. This check is not necessary for non-scavenged chunks because all the entries are still present.

We have made some performance improvements in this area where a user can choose to trade off some memory for speed gains and reduced disk pressure during merges. Our tests show speed gains of **around 8x.**

You can estimate the maximum amount of additional memory (in GB) you will need with the following formula:  
_**Avg. number of events per chunk file / 40000**_

For example, with 200000 events per chunk file, the maximum amount of memory required will be 5GB.

_This feature is not enabled by default. You can enable it by adding_ **OptimizeIndexMerge: true** _to your config or adding_ **--optimize-index-merge** _to your command line arguments._

## Client Changes (Non-breaking)
#### [#1583](https://github.com/EventStore/EventStore/pull/1583) - **(All Platforms)** Add ability to add custom node discovery
This allows custom implementation of node discovery by implementing the `IEndPointDiscoverer` interface (for example, to obtain IP endpoints from _consul_ or text files). The method `Create(ConnectionSettings connectionSettings, IEndPointDiscoverer endPointDiscoverer, string connectionName)` has been added to `EventStoreConnection`.


#### [#1582](https://github.com/EventStore/EventStore/pull/1582) - **(All Platforms)** Add queue timeout facility

`SetQueueTimeoutTo(TimeSpan timeout)` in `ConnectionSettingsBuilder`

This allows the client to apply backpressure during an overload when the _operations queue_ is full and many operations are waiting to be processed. An `OperationExpiredException` exception will be thrown if an operation stays in the queue for longer than the timeout set.

By default, no exception will be thrown (as in previous versions) unless `SetQueueTimeoutTo` is called on the builder.

Thanks to [bartelink](https://github.com/bartelink) for contributing this feature!

#### [#1578](https://github.com/EventStore/EventStore/pull/1578) - **(All Platforms)** KeepDiscovering option added for infinite nodes discovery attempts
Add `KeepDiscovering()` to your `ClusterSettingsBuilder`

#### [#1557](https://github.com/EventStore/EventStore/pull/1557) - **(All Platforms)** Add PreferSlaveNode to Connection Builder

Add `PreferSlaveNode()` to your `ConnectionSettingsBuilder` or `ClusterSettingsBuilder` to prefer doing operations on slave nodes.
This also requires adding `PerformOnAnyNode()` on the `ConnectionSettingsBuilder`

Thanks to [Salgat](https://github.com/Salgat) for contributing this feature!

# Full Changelog
## Server

- [#1613](https://github.com/EventStore/EventStore/pull/1613) - **(All Platforms)** Handle unauthorised access exceptions when replacing indexmap files.
- [#1591](https://github.com/EventStore/EventStore/pull/1591) - **(All Platforms)** Overflow bug when caching midpoints to PTable with more than Int.MaxValue entries
- [#1580](https://github.com/EventStore/EventStore/pull/1580) - **(All Platforms)** Allow event data/metadata to be stored as JSON array through HTTP API
- [#1572](https://github.com/EventStore/EventStore/pull/1572) - **(All Platforms)** Add ResponseUrl to HttpEntity to allow prefixes to be used
- [#1561](https://github.com/EventStore/EventStore/pull/1561) - **(All Platforms)** Fix collection modified exceptions that can occur and fault a projection
- [#1555](https://github.com/EventStore/EventStore/pull/1555) - **(All Platforms)** Add timeout functionality to IODispatcher.
- [#1548](https://github.com/EventStore/EventStore/pull/1548) - **(All Platforms)** AsyncWrapper Log fix
- [#1547](https://github.com/EventStore/EventStore/pull/1547) - **(All Platforms)** Optimize existAt calls on scavenged chunks using bloom filters for faster index merges

## Persistent Subscription

- [#1560](https://github.com/EventStore/EventStore/pull/1560) - **(All Platforms)** Persistent subscription bug fix: when reading end of stream and a live event is received

## Projection

- [#1579](https://github.com/EventStore/EventStore/pull/1579) - **(All Platforms)** Add linkMetadata to event feed reader (Projection debugging)

## UI

- [#193](https://github.com/EventStore/EventStore.UI/pull/193) - **(All Platforms)** Reorder and keep next/prev button fixed
- [#191](https://github.com/EventStore/EventStore.UI/pull/191) - **(All Platforms)** UI fix: Long string in state/results box moves projection stats to far right
- [#190](https://github.com/EventStore/EventStore.UI/pull/190) - **(All Platforms)** Projection debugging: State was not being updated when processing last event
- [#189](https://github.com/EventStore/EventStore.UI/pull/189) - **(All Platforms)** linkMetadata parameter missing from runStep()
- [#187](https://github.com/EventStore/EventStore.UI/pull/187) - **(All Platforms)** Added EventId to the event details view

## .NET Client

- [#1611](https://github.com/EventStore/EventStore/pull/1611) - **(All Platforms)** Add TRACE constant to ClientAPI to be able to use System.Diagnostics.WriteLine with Debug Logger
- [#1601](https://github.com/EventStore/EventStore/pull/1601) - **(All Platforms)** Make UseDebugLogger write to Debugger from NuGet version of client lib OOTB
- [#1583](https://github.com/EventStore/EventStore/pull/1583) - **(All Platforms)** Add ability to add custom node discovery
- [#1600](https://github.com/EventStore/EventStore/pull/1600) - **(All Platforms)** Handle IPv6 addresses from Dns.GetHostAddresses
- [#1582](https://github.com/EventStore/EventStore/pull/1582) - **(All Platforms)** Add queue timeout facility
- [#1578](https://github.com/EventStore/EventStore/pull/1578) - **(All Platforms)** KeepDiscovering option added for infinite nodes discovery
- [#1567](https://github.com/EventStore/EventStore/pull/1567) - **(All Platforms)** Remove Thread.Sleep from ClientAPI
- [#1557](https://github.com/EventStore/EventStore/pull/1557) - **(All Platforms)** Add PreferSlaveNode to Connection Builder
