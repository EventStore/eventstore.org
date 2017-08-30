---
title: "Projections vs RxJS vs etc"
date: 2013-02-18T14:39Z
author: "Greg Young"
layout: blog-post
---

There was a pretty good question this morning when I checked comments on posts. “What is the difference between projections and, say, rxjs?”

We could as easily include any of the functional reactive libraries out there (bacon.js, flapjax, elm, Rx, etc). We can also start going way back and looking at predecessors like CLM.

Let’s start with the similarities both are JavaScript. Both are functional reactive APIs (this is why they look rather similar). They if you go way back trace their lineages to the same places. All have concepts like “streams”, “events”, and “behaviours” as these are underlying concepts. There are however some differences as well.

In particular the tools are handling CEP.

The largest difference is most of those tools listed are only capable of being run from now forward (for some you could write persistent adapters, we had experimented with one for Rx). They are small libraries for dealing with things like events in a JavaScript UI. You could build up everything around something like RxJS as well (e.g. we could switch out our definitions for ones matching theirs).

When we talk about projections, the streams are persistent (and distributed). We host V8 internally and use this API as our query language over persistent streams of events. A projection is not just for running from this point forward but for running against previous history as well. This is a very powerful idea (and not a new one).

Projections are the query language of the Event Store. When you write a projection you can specify that you want it to run for history and stop or you want it to run for the history and continue. The Event Store will also handle you doing this in a durable, consistent, and distributed way (over terabytes of indexed data). A projection will survive a power outage as example if configured to do so.

I hope this helps to clear up some of the similarities and differences between the options.