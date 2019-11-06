---
title: "Event Store 5.0.4"
author: "Pieter Germishuys"
layout: blog-post
---

Event Store 5.0.4 is out! It is available for the following operating systems:

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
sudo apt-get install eventstore-oss=5.0.4-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 5.0.4
```

## Upgrade Procedure
To upgrade a cluster, a usual rolling upgrade can be done:
- Pick a node (Start with slave nodes first, then choose the master last)
- Stop the node, upgrade it and start it

## Event Store 5.0.4 Changelog

### Features
* [#2041](https://github.com/EventStore/EventStore/pull/2041) - **(Core Database)** Provide an option to Log Failed Authentication Attempts.
* [#2042](https://github.com/EventStore/EventStore/pull/2042) - **(Core Database)** Provide an option to stop writing statistics into the database.

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
