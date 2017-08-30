---
title: "Updated repository sample code"
date: 2013-04-25T00:36Z
author: "James Nugent"
layout: blog-post
---

As you may be aware, we’re removing the `$streamCreated` event which currently appears in all streams in favour of a metadata stream.

This is currently done on the development branch, and can affect how you compute expected versions for streams. I’ve updated the sample code for the CommonDomain repository previously shown in the getting started series on the `WithoutStreamCreated` branch.

[https://github.com/EventStore/getting-started-with-event-store/tree/WithoutStreamCreated](https://github.com/EventStore/getting-started-with-event-store/tree/WithoutStreamCreated)

Specifically note the changes in the save method and in the get specific version by ID method!