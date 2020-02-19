---
title: "Event Store 5.0.6"
author: "Shaan Nobee"
layout: blog-post
---

Event Store 5.0.6 is out!  

This release contains some important bug fixes related to TCP connections for both the server and the .NET client. The fixes bring an overall improvement to the stability of subscriptions.

This release fixes a long-standing bug in Persistent subscriptions which would cause them to appear to hang and stop delivering events as well as an integer overflow bug in projection checkpoints and a bug in the .NET client related to the swapping of the Commit/Prepare positions. Please consult the Changelog for more details.

The release is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)
- Amazon Linux 2 AMI (Commercial version)
- Oracle Linux 7 (Commercial version)

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/).

The packages can be installed using the following instructions.

**Ubuntu 16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=5.0.6-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 5.0.6
```

**Client Packages**  
[EventStore Client](https://www.nuget.org/packages/EventStore.Client/)  
```
dotnet add package EventStore.Client --version 5.0.6
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client.Embedded/)  
```
dotnet add package EventStore.Client.Embedded --version 5.0.6
```

## Upgrade Procedure
To upgrade a cluster, a usual rolling upgrade can be done:
- Pick a node (Start with slave nodes first, then choose the master last)
- Stop the node, upgrade it and start it

## Event Store 5.0.6 Changelog

### Bug Fixes
* [#2230](https://github.com/EventStore/EventStore/pull/2230) - **(Projections)** Fix stream position overflow bug in checkpoint tag
* [#2193](https://github.com/EventStore/EventStore/pull/2193) - **(Client)** Fix Position constructor in client operations
* [#2214](https://github.com/EventStore/EventStore/pull/2214) - **(Core)** Fix race condition in TCP connections which allows messages to be dispatched after connection closed
* [#2255](https://github.com/EventStore/EventStore/pull/2255) - **(Core)** Fix socket leak in TCP connections
* [#2062](https://github.com/EventStore/EventStore/pull/2062) - **(Core)** Pass in correct socket close timeout in seconds instead of milliseconds

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
