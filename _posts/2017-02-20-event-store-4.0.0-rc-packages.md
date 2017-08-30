---
title: "Event Store 4.0.0 Release Candidate Packages"
author: "Pieter Germishuys"
layout: blog-post
---

We are happy and excited to announce the release candidate 1 packages for Event Store 4.0.0. They are available for the following operating systems:

- Windows (via Chocolatey)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

With Event Store 4.0.0 our headline feature will be projections. There are some other notable items that we have addressed and this is thanks to the community members who have raised these issues.

- Introduced a Package for Ubuntu 16.04.
- JavaScript Projections now support ECMASCRIPT 6.
- A series of projection issues has been fixed, which includes projections that seem to have just gotten stuck and refused to continue processing.
- Event Store on Linux has been upgraded to Mono 4.6.2.
- Event Store on Windows has been upgraded to .NET 4.6.
- Upgrade the stream version from int32 to int64. This ups the limit from events in a stream from int.MaxValue to long.MaxValue.

The following is the list of current release notes for RC 1

## Event Store Server 4.0.0 RC 1 release notes

- [#1213](https://github.com/EventStore/EventStore/pull/1213) - **(All Platforms)** - Support 64bit Event Numbers.
- [#1066](https://github.com/EventStore/EventStore/pull/1066) - **(All Platforms)** - Upgrade to Mono 4.6.2 and .NET 4.6
- [#1129](https://github.com/EventStore/EventStore/pull/1129) - **(All Platforms)** - Handling message expiry on reads for projections
- [#1133](https://github.com/EventStore/EventStore/pull/1133) - **(All Platforms)** - Prevent system events from being passed through the event by type filter
- [#1138](https://github.com/EventStore/EventStore/pull/1138) - **(All Platforms)** - Provide the ability to not timeout messages in competing consumers
- [#1139](https://github.com/EventStore/EventStore/pull/1139) - **(All Platforms)** - Handling of message expiry in the Event By Type Index Reader
- [#1165](https://github.com/EventStore/EventStore/pull/1165) - **(All Platforms)** - Remove the System.Net.Http PCL
- [#1101](https://github.com/EventStore/EventStore/pull/1101) - **(All Platforms)** - Upgrade V8. 
This provides the ability for projections to be written in ECMASCRIPT 6 as well as stability and performance improvements that came with the upgrade.
- [#1178](https://github.com/EventStore/EventStore/pull/1178) - **(All Platforms)** - Remove `whenAny` from the projections API.
- [#1193](https://github.com/EventStore/EventStore/pull/1193) - **(All Platforms)** - Fault projections with more details as part of the exception to allow for better information when debugging projection related issues.
- [#1203](https://github.com/EventStore/EventStore/pull/1203) - **(All Platforms)** - Fault the projection on failed subscription handle and in these cases previously the other projections would never see the event.
- [#1205](https://github.com/EventStore/EventStore/pull/1205) - **(All Platforms)** - When reading from all which is something that projections do, there existed a case where an event might be skipped in a special case. This is now being catered for.
- [#1210](https://github.com/EventStore/EventStore/pull/1210) - **(All Platforms)** - Monitoring service now includes Ssl tcp connections in tcp stats

## Where can I get the release candidate 1 packages?

The alpha packages can be installed using the following instructions.

**Ubuntu 14.04/16.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS-PreRelease))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS-PreRelease/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=4.0.0-rc1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/4.0.0-rc1))

```
choco install eventstore-oss -version 4.0.0-rc1 -pre
```

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
