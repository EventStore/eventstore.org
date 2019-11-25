---
title: "Event Store 4.1.4"
author: "Shaan Nobee"
layout: blog-post
category: 'Release Notes'
---

Event Store 4.1.4 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04 (EOL reached)
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

Following the release of [version 5.0.2 this week](https://eventstore.org/blog/20190723/event-store-5.0.2-release/), we have now released a minor update to version 4 which contains a few bug fixes backported from 5.0.2.

Some of the bug fixes are critical and we strongly recommend our users to upgrade to this version as soon as possible.

Please note that Ubuntu 14.04 (Trusty Tahr) has reached its end-of-life and thus we will stop releasing packages for it as from the next version.

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/).

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=4.1.4-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 4.1.4
```

**Client Packages**  
[EventStore Client](https://www.nuget.org/packages/EventStore.Client/)  
```
dotnet add package EventStore.Client --version 4.1.4
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client.Embedded/)  
```
dotnet add package EventStore.Client.Embedded --version 4.1.4
```

## Upgrade Procedure
To upgrade a cluster, a usual rolling upgrade can be done:
- Pick a node (Start with slave nodes first, then choose the master last)
- Stop the node, upgrade it and start it

## Event Store 4.1.4 Changelog

### Important Bug Fixes
* [#1930](https://github.com/EventStore/EventStore/pull/1930) - **(Core Database)** Fix UnbufferedFileStream.SetLength() bug  
This is a critical bug that affects versions 4.1.0 to 4.1.3 and 5.0.0 to 5.0.1. It applies only if running EventStore with the `Unbuffered` configuration option set to `True`. This option is set to `False` by default. The following fatal error will be thrown when completing a chunk file and most of the data in the chunk file being completed will be lost:
```
EXCEPTION OCCURRED
System.NotSupportedException: Unable to expand length of this stream beyond its capacity.
   at System.IO.UnmanagedMemoryStream.Write(Byte[] buffer, Int32 offset, Int32 count)
   at EventStore.Core.TransactionLog.Chunks.TFChunk.TFChunk.WriteRawData(WriterWorkItem workItem, Byte[] buf, Int32 len) in TFChunk.cs
```
* [#1936](https://github.com/EventStore/EventStore/pull/1936) - **(Client)** Client subscription partition tolerance  
This fix improves the stability of catch-up subscriptions during reconnections

### Miscellaneous
* [#1932](https://github.com/EventStore/EventStore/pull/1932) - **(Web UI)** Prevent browser from invoking Basic Auth login dialog on Chrome
* [#1933](https://github.com/EventStore/EventStore/pull/1933) - **(Client)** Enable logging of errors when attempting to discover nodes via DNS or gossip seeds

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).