---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Installing on Ubuntu via the Debian Repository"
section: "Server"
version: "3.8.0"
pinned: true
---

<span class="note--warning">
These instructions apply only to users of the Open Source Event Store products. Commercial customers have access to a separate package repository which contains all of the commercial tools in packaged form.
</span>

The Event Store packages are hosted on [PackageCloud](https://packagecloud.io/EventStore/EventStore-OSS) and the installation instructions for the supported distributions can be found [here](https://packagecloud.io/EventStore/EventStore-OSS/install).

We recommend pinning a specific version in production.

## Configuration

When the Event Store package is installed, the service is not started by default. This is to enable you to modify the configuration, located at `/etc/eventstore/eventstore.conf` according to your requirements. This is to prevent a default database being created.

## Starting and stopping the Event Store service

The Event Store packages come complete with upstart scripts which supervise instances. Upon package installation they are not started by default. To start the Event Store service after modifying the configuration to suit your requirements, use this command:

```bash
sudo service eventstore start
```

To stop the Event Store service, use this command:

```bash
sudo service eventstore stop
```
