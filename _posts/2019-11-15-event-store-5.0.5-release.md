---
title: "Event Store 5.0.5"
author: "Hayley Campbell"
layout: blog-post
category: 'Release Notes'
---

Event Store 5.0.5 is out!
This release contains an important bug fix for SSL connections on Event Store versions 5.0.0 and above.

The bug can cause exceptions both on the client and server when using secured TCP connections to Event Store.
If you are using SSL TCP connections with Event Store, we recommend upgrading both your server and client to this version.

It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04 (EOL reached)
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)
- Amazon Linux 2 AMI (Commercial version)
- Oracle Linux 7 (Commercial version)

Please note that Ubuntu 14.04 (Trusty Tahr) has reached its end-of-life and thus we will stop releasing packages for it as from the next version.

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/).

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=5.0.5-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 5.0.5
```

**Client Packages**  
[EventStore Client](https://www.nuget.org/packages/EventStore.Client/)  
```
dotnet add package EventStore.Client --version 5.0.5
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client.Embedded/)  
```
dotnet add package EventStore.Client.Embedded --version 5.0.5
```

## Upgrade Procedure
To upgrade a cluster, a usual rolling upgrade can be done:
- Pick a node (Start with slave nodes first, then choose the master last)
- Stop the node, upgrade it and start it

## Event Store 5.0.5 Changelog

### Fixes
* [#2051](https://github.com/EventStore/EventStore/pull/2051) - **(Core Database and Client)** Bug fix: ConcurrentQueueWrapper can return negative count.

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
