---
title: "Event Store 5.0.3"
author: "Pieter Germishuys"
layout: blog-post
---

Event Store 5.0.3 is out! It is available for the following operating systems:

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
sudo apt-get install eventstore-oss=5.0.3-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 5.0.3
```

## Upgrade Procedure
To upgrade a cluster, a usual rolling upgrade can be done:
- Pick a node (Start with slave nodes first, then choose the master last)
- Stop the node, upgrade it and start it

## Event Store 5.0.3 Changelog

### Important Bug Fixes
* [#1971 ](https://github.com/EventStore/EventStore/pull/1971) - **(Core Database)** Persistent Subscriptions: Always remove completed events from all connections to prevent outstanding messages from building up in the connection queues
* [#1998](https://github.com/EventStore/EventStore/pull/1998) - **(Core Database)** Persistent Subscriptions: Retry the load checkpoint read if the read expires.
* [#1990](https://github.com/EventStore/EventStore/pull/1990) - **(Core Database)** We have fixed a bug in our intermediate index cache.

### Miscellaneous
* [#1991](https://github.com/EventStore/EventStore/pull/1991) - **(Core Database)** We have provided the ability to configure the connection queue size threshold. There are scenarios where a client might run into the maximum connection queue size. A likely scenario where this might occur is when a client is overwhelmed by a large number of events being ingested into Event Store and then being delivered to a subscription.

### Commercial
* Release of Amazon Linux 2 and Oracle 7 packages
* Fixed issue on Amazon Linux package where manual changes to the EventStore configuration file would be overwritten when the node starts up



## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
