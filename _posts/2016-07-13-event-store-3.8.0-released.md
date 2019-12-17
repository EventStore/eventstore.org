---
title: "Event Store 3.8.0 Released"
author: "Pieter Germishuys"
layout: blog-post
category: 'Release Notes'
---

Event Store 3.8.0 is now released! This release contains a number of improvements and bug fixes. The release was focussed on an issue related to Projections whereby once a stream has been written to from one projection and the projection deleted, another projection could not write to that same stream.

The first step to resolving the issue was to ensure that the object that tracks and emits events to streams via the `linkTo` and `emit` projection functions handles streams that have been deleted a bit better.

To explain a little more, when a projection emits an event via the above mentioned functions, it will write the event and metadata for the event which contains details about the projection that produced the event.

When a projection attempts to write an event via the previously mentioned functions it will read the last event in the stream that it wants to write events to and use the metadata to determine if the current projection is the one that last wrote an event to the stream and if not, it will fail with an error message explaining that multiple projections are emitting to the same stream.

The second part of fixing this issue was giving the user the ability to track and delete emitted streams for a projection. The HTTP API for projections creation and deletion have been updated with `trackEmittedStreams` and `deleteEmittedStreams` respectively.

There is also an accompanying update to the .NET Client API and the Embedded Client. These are now in the NuGet gallery.

## Event Store Server 3.8.0 release notes

- [#970](https://github.com/EventStore/EventStore/pull/970) **(All Platforms)** (Projections) Allow the user to enable tracking of the streams emitted by a projection, and to delete the emitted streams when deleting the projection.
- [#973](https://github.com/EventStore/EventStore/pull/973) **(All Platforms)** (HTTP API) Only use external or advertised http ip address for links returned over http
- [#979](https://github.com/EventStore/EventStore/pull/979) **(All Platforms)** Retry deleting the scavenge temp file if an error occurs during deletion, and stops the scavenge if the temp files cannot be deleted.

## .NET Client 3.8.0 release notes

- [#966](https://github.com/EventStore/EventStore/pull/966) **(All Platforms)** Fix a race condition when subscribing to a persistent subscription.

## Event Store UI 3.8.0 release notes

- [#128](https://github.com/EventStore/EventStore.UI/pull/128) **(All Platforms)** Add an option to track and delete the streams a projection emits to.
- [#130](https://github.com/EventStore/EventStore.UI/pull/130) **(All Platforms)** Show failures and errors for scavenges on the admin and scavenge screens.