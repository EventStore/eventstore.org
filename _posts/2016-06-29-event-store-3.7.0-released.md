---
title: "Event Store 3.7.0 Released"
author: "Hayley Campbell"
layout: blog-post
---

Event Store 3.7.0 is now released! This release contains a number of improvements and bug fixes, as well as a rather large update to the Embedded Client. The next release will mainly focus on improving the stability of projections in preparation for version 4.0.

Included in this release is a fix for an issue affecting scavenges where Event Store failed to write scavenge status updates to the scavenge history stream, which resulted in errors in the logs. We have added a new command to the Event Store CLI tool which will clean up the scavenge streams and remove this error. If you were affected by this issue, get the updated tool from the [downloads page](/downloads).

There is also an accompanying update to the .NET Client API and the Embedded Client. These are now in the NuGet gallery.

## Event Store Server 3.7.0 release notes

- [#902](https://github.com/EventStore/EventStore/pull/902) **(All Platforms)** Add ExpectedVersion.StreamExists which will only allow appending to a stream if it already exists.
- [#915](https://github.com/EventStore/EventStore/pull/915) **(All Platforms)** Use the Embedded Client’s builder internally to build the ClusterVNode.
- [#921](https://github.com/EventStore/EventStore/pull/921) **(All Platforms)** (HTTP API) Add application/octet-stream in HTTP API to support just data events.
- [#925](https://github.com/EventStore/EventStore/pull/925) **(All Platforms)** Wait for subsystems to initialise before publishing the system ready message.
- [#934](https://github.com/EventStore/EventStore/pull/934) **(All Platforms)** (Projections) Add RunProjections method for backwards compatibility for clients upgrading to the embedded client pre 4.0.
- [#935](https://github.com/EventStore/EventStore/pull/935) **(All Platforms)** Change the config file default option to correctly reflect its source.
- [#937](https://github.com/EventStore/EventStore/pull/937) **(All Platforms)** Ensure persistent subscription checkpoint version doesn’t get corrupted when an error occurs while writing a checkpoint.
- [#938](https://github.com/EventStore/EventStore/pull/938) **(All Platforms)** (Projections) Only initialise projections when the core worker readers are ready.
- [#951](https://github.com/EventStore/EventStore/pull/951) **(All Platforms)** Fixed an error caused by the ContentType header on a forwarded http message being null.
- [#953](https://github.com/EventStore/EventStore/pull/953) **(All Platforms)** (Projections) Fixed complete TF position required error.
- [#956](https://github.com/EventStore/EventStore/pull/956) **(All Platforms)** (HTTP API) Use the advertised IP address to build the atom links, if they are set.
- [#959](https://github.com/EventStore/EventStore/pull/959) **(All Platforms)** (HTTP API) Return the current version on a WrongExpectedVersion response over HTTP.
- [#962](https://github.com/EventStore/EventStore/pull/962) **(All Platforms)** Fixed an issue where we weren’t retrying on the writes of scavenge statuses.

## .NET Embedded Client 3.7.0 release notes

- [#915](https://github.com/EventStore/EventStore/pull/915) **(All Platforms)** Use the Embedded Client's builder internally to build the ClusterVNode.

## .NET Client 3.7.0 release notes

- [#902](https://github.com/EventStore/EventStore/pull/902) **(All Platforms)** Add ExpectedVersion.StreamExists which will only allow appending to a stream if it already exists.

## Event Store UI 3.7.0 release notes

- [#127](https://github.com/EventStore/EventStore.UI/pull/127) **(All Platforms)** Add a note to indicate to the user that there might have been an issue writing the status of the scavenge to disk if the scavenge status does not appear to be updating.