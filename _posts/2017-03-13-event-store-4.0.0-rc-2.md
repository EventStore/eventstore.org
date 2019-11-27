---
title: "Event Store 4.0.0 Release Candidate 2"
author: "Pieter Germishuys"
layout: blog-post
category: 'Release Notes'
---

We are happy and excited to announce the release candidate 2 packages for Event Store 4.0.0. They are available for the following operating systems:

- Windows (via Chocolatey)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

## Event Store Server 4.0.0 RC 2 release notes

## Event Store Server

- [#1224](https://github.com/EventStore/EventStore/pull/1224) - **(All Platforms)** - Stop attempting to infinitely retry on projection createss.
- [#1225](https://github.com/EventStore/EventStore/pull/1225) - **(All Platforms)** - Log expired operations
- [#1226](https://github.com/EventStore/EventStore/pull/1226) - **(All Platforms)** - Handle hard deletes correctly
- [#1234](https://github.com/EventStore/EventStore/pull/1234) - **(All Platforms)** - Fix incorrect casts when resolving link tos
- [#1241](https://github.com/EventStore/EventStore/pull/1241) - **(All Platforms)** - Fault a projection that is attempting to emit a bad event

## .NET Client

- [#1230](https://github.com/EventStore/EventStore/pull/1230) - **(All Platforms)** - Add option to prefer a randomly selected node

## Event Store UI

- [#144](https://github.com/EventStore/EventStore.UI/pull/144) - Changed Competing Consumers label to Persistent Subscriptions

## Where can I get the release candidate 2 packages?

The alpha packages can be installed using the following instructions.

**Ubuntu 14.04/16.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS-PreRelease))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS-PreRelease/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=4.0.0-rc2
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/4.0.0-rc2))

```
choco install eventstore-oss -version 4.0.0-rc2 -pre
```

**Client Packages** (via [Nuget](https://www.nuget.org/packages/EventStore.Client/4.0.0-rc2))

```
Install-Package EventStore.Client -Pre
```

## Release Candidate 2 Life Expectancy

Unless any show stoppers are identified, we will proceed with the release of Event Store 4.0.0, starting next week Monday the 20th of March 2017.

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
