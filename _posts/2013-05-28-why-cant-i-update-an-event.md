---
title: "Why can’t I update an event?"
date: 2013-05-28T07:21Z
author: "Greg Young"
layout: blog-post
category: 'Articles'
---

Last week on a call with someone the question came up about the Event Store about why can they not update and event and how should they handle the case where they need to. The conversation that came out of this was very rich in architectural insight into how the event store works as well as overall event sourcing understanding so I thought that it would be worth spending a bit of time to write up where the constraint comes from.

## An Event Sourcing Perspective

Let's start with why you want to update an event? An event is a fact that happened at a point in time with the understanding of it from that point in time, a new understanding of the fact would be a new fact(naturally this does not apply to politicians). To update a previous event is generally a very bad idea. Many want to go back and update events to new versions, this is not the best way to handle versioning!

The preferred mechanism from an event sourcing perspective is to write a new face that supercedes the old fact. As an example I could write that event 7 is a mistake, this is a correction, I might as well put in a comment “this was due to bug #1342” (similar to a journal entry in accounting). There are a few reasons this is a better way of handling things.

The first is my ability to look back at my history. If I were to change the fact and I look back at that point in time I have changed what it means. What about others who made decisions at that point in time? I can no longer see what it was they made decisions off of. Beyond this I might have a very valid query to ask your event streams of “how long on average does it take us to find bugs in previous events”.

The second model leads us to two types of queries supported on event streams (as-of vs as-at).

Beyond that with Event Sourcing the updating of an event can be inherently evil. How do you update any projections that the update occured? What about other subscribers who may be listening to the streams? Any easy answer might be to replay fully all involved with the stream but this quickly falls apart.

These are the primary reasons why the Event Store does not support an update operation on an event. There are however some wonderful architectural benefits that come from this particular constraint.

## Architectural Goodness

If we prevent an event from ever being updated, what would the cachability of that event be? Yes it would be infinite. The Event Store supports a RESTful API (ATOM). All events served from the event store have infinite cachability, what does that mean?

Imagine you have a projection updating into a SQL table that has been running for the past eight weeks. You make a change and need to restart it (replaying from event 0). When the replay occurs and it requests events from the Event Store where do they likely come from? Your hard drive! You don’t make requests to the Event Store for them.

Beyond the events being infinitely cacheable if you look through our atom implementation in fact every single request we serve with the exception of the head uri (http://somewhere.com/streams/{stream}) is also infinitely cacheable. In other words when you want to reread $all (say for 5m events) you will hit exactly one non-cacheable request!

This is very important when we start talking about scalability and performance. The Event Store can pretty easily serve 3-5k atom requests/second on a laptop (per node in clustered version) but how many will actually get to the Event Store? In order to scale you focus on commoditized reverse proxies in front of the Event Store not scaling the Event Store itself. nginx or varnish can easily saturate your network, just drop them in front only head calls make it through (and there is even a setting per stream to allow caching for x seconds of head links).

This is often a hard lesson to learn for developers. More often than not you should not try to scale your own software but instead prefer to scale commoditized things. Building performant and scalable things is hard, the smaller the surface area the better. Which is a more complex problem a basic reverse proxy or your business domain?

This also affects performance of replays for subscribers as you can place proxies near the subscribers (local http cache is a great start!). This is especially true for say an occasionally connected system. Gmail uses this trick to provide "offlining out of the box" for web apps. Since much of the data will already be in the http cache your hits will be hitting it, in many cases you can build say a mobile app with no further support.

Over Atom if we allowed updates, NO uris could be cacheable!

## This is all cool but I actually need to update!

Occasionally there might be a valid reason why an event actually needs to be updated, I am not sure what they are but I imagine there must be some that exist. There are a few ways this can actually be done.

The generally accepted way of handling the scenario while staying within the no-update constraintis to create an entire new stream, copy all the events from the old stream (manipulating as they are copied). Then delete the old stream. This may seem like a PITA but remember all of the discussion above (especially about updating subscribers!).

Some however may be using the TCP API and are willing to take the pains and complexity that come from subscribers (you can imagine they have none). In this one case, updates would be acceptable and simpler than adding new events. We have been going back and forth on whether or not to support this. It would not be much work at all for us but I imagine that it would be misused 1000 times for every 1 time it was used reasonably. I am reminded of the examples of being able to call .NET code from a biztalk orchestration or being able to execute .NET code inside my SQL database both have valid uses but should rarely be used. Perhaps we will make a command line parameter --run-with-scissors-updates or make people build from source to enable.