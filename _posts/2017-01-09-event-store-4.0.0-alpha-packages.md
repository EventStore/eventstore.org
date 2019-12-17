---
title: "Event Store 4.0.0 Alpha Packages"
author: "Pieter Germishuys"
layout: blog-post
category: 'Release Notes'
---

Merry Christmas and a Happy new year!

We are announcing the alpha packages for Event Store 4.0.0. They are available for the following operating systems:

- Windows (via Chocolatey)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

With Event Store 4.0.0 our headline feature will be projections. There are some other notable items that we have addressed and this is thanks to the community members who have raised these issues.

- Introduced a Package for Ubuntu 16.04.
- JavaScript Projections now support ECMASCRIPT 6.
- A series of projection issues has been fixed, which includes projections that seem to have just gotten stuck and refused to continue processing.
- Event Store on Linux has been upgraded to Mono 4.6.2.
- Event Store on Windows has been upgraded to .NET 4.6.

We have also taken the opportunity to upgrade the stream version from int32 to int64.

## Where can I get the alpha packages?

The alpha packages can be installed using the following instructions.

**Ubuntu 14.04/16.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS-PreRelease))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS-PreRelease/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=4.0.0-alpha1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/4.0..0-alpha1))

```
choco install eventstore-oss -version 4.0.0-alpha1 -pre
```

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
