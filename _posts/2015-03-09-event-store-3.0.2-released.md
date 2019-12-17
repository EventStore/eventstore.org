---
title: "Event Store 3.0.2 Released"
date: 2015-03-09T12:00Z
author: "James Nugent"
layout: blog-post
category: 'Release Notes'
---

**tl;dr - all users of Event Store should upgrade to version 3.0.2.**

Event Store OSS v3.0.2 includes a critical fix recommended for all users of Event Store, as well as some minor updates to the User Interface. This also co-incides with the release of the commercial edition of Event Store HA 3.0.2, and version 3.0.2 of the .NET client API, which is available on NuGet.

The changes are listed below:

Event Store Server
------------------

- A bug which can cause the read index to fail to rebuild has been fixed (Commercial support inquiry, no issue number). Inclusion of this fix means that version 3.0.2 is recommended for all users of Event Store.
- Better diagnostic logging has been added to several log messages.
- The lock held during index merging is now held for significantly less time. This reduces the chances of index corruption, especially on slow disks.
- Requesting a stream as HTML redirects to the new UI rather than presenting broken HTML.

Event Store UI
--------------

- Fixed a consistency issue in the styling of buttons EventStore/EventStore.UI#46
- Included a friendlier notification system using Toastr. EventStore/EventStore.UI#48
- Fixed a bug of the incorrect usage of positionEventNumber EventStore/EventStore.UI#50
- Another consistency fix where the "Include Queries" check box has now been changed to a button that toggles on/off. EventStore/EventStore.UI#55
- Bug fix: stop the projection before we attempt to delete it. EventStore/EventStore.UI#56
- Bug fix: ensure that we check if the stream id exists before we add it to the list of streams. EventStore/EventStore.UI#57

Event Store .NET Client API
---------------------------

- Fixed a bug which can cause a deadlock during reconnection under certain network conditions.
- Fixed a packaging issue which required the embedded client to also reference Protocol Buffers .NET. This dependency is now internalized.
