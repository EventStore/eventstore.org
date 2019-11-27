---
title: "Getting Started: Part 3 – Subscriptions"
date: 2013-03-06T18:05Z
author: "James Nugent"
layout: blog-post
category: 'Tutorials'
---

In part 2 we looked at hooking up the CommonDomain repository. In this post we’ll look at subscriptions. In part 3(a) we’ll look at how you might hook up denormalizers to produce read models (for example).

Unlike in JOES, there is no concept in the Event Store of an event dispatcher which receives written events. However, you can do something similar using subscriptions, whereby events are pushed subscribers after writing.

You can subscribe either to an individual stream, or to all streams. For each of these options, there are two different types of subscription:

- Live-only subscriptions
- Catch-up subscriptions

## The basics of subscriptions

You can subscribe to any stream, including system streams (e.g. `$stats-127.0.0.1:2113`), and streams created by projections (see Greg’s series about repartitioning event streams using `linkTo`, and producing new events using `emit`). When an event is written to a stream to which you are subscribed, a callback to register at the time of subscription is called.

To represent events delivered over a subscription, we have a type named `ResolvedEvent`. The same `ResolvedEvent` type is used for all types of subscription in the .NET Client API, and is fairly straightforward:

- **`RecordedEvent Event`** - If the event is a normal (i.e. non-link) event, the event will be contained in here. If the event is a link event, and `IsResolved` is true, this will contain the event which is the target of the link.
- **`RecordedEvent Link`** - If the event read is a link event, this will contain the link event itself. If the event isn’t a link event, this will be null.
- **`bool IsResolved`** - Indicates whether or not a link event has been resolved.
- **`RecordedEvent OriginalEvent`** - Always returns the event which caused the subscription to fire. In the case of a link event, it will contain the link, in the case of a normal event, it will contain the normal event.
- **`Position? OriginalPosition`** - For events received "live" over a subscription, this contains the logical position in the transaction file to which the event was written (note, for link events this will be the position of the link itself, not the position of the target of the link).
- **`OriginalStreamId`** - This returns the stream ID of whichever event is returned by `OriginalEvent`.
- **`OriginalEventNumber`** - This returns the event number in the stream of whichever event is returned by `OriginalEvent`.

A subscription can be dropped, either because the `EventStoreConnection` which owns it becomes disconnected, because the client is not servicing the subscription fast enough (i.e. the internal queues back up too much), or because of an internal error. There is a second callback for handling this.

## Live-only subscriptions

First we’ll look at live-only subscriptions, both to an individual stream and to all streams. This delivers events written from the point of subscribing until either it is unsubscribed or the subscription is dropped.

### Single Stream

To subscribe to an individual stream, you use the `SubscribeToStream` method on `EventStoreConnection`:

```
public Task<EventStoreSubscription> SubscribeToStream(string stream, bool resolveLinkTos, Action<EventStoreSubscription, ResolvedEvent> eventAppeared, Action<EventStoreSubscription, string, Exception> subscriptionDropped = null)
```

- **`stream`** – this is the name of the stream to which to subscribe.
- **`resolveLinkTos`** – this determines whether link events in the stream will be resolved or not (see the discussion above for how this affects the ResolvedEvent object given to the callback).
- **`eventAppeared`** – called whenever an event arrives.
- **`subscriptionDropped`** – called if the subscription drops.

The `EventStoreSubscription` object can be used later to unsubscribe if necessary.

### All Streams

To subscribe to all events, you instead use the `SubscribeToAll` method on `EventStoreConnection`, which is the same as for an individual stream other than not needing to specify a stream name.

```
public Task<EventStoreSubscription> SubscribeToAll(bool resolveLinkTos, Action<EventStoreSubscription, ResolvedEvent> eventAppeared, Action<EventStoreSubscription, string, Exception> subscriptionDropped = null)
```

## Live-only vs Catch-up subscriptions

One of the most common requests we had when the Client API was first released was for guidance on building a durable subscriber, which could process events written during downtime when it came back up. As a result of this, and the relative complexity of the necessary code, we added the concept of a catch-up subscription to the Client API. This is present in Client API packages >= 1.1.0-rc1.

A catch-up subscription works in a very similar way to a live-only subscription, with one notable difference: you specify the point from which events will be pushed to you (in the form of a position if you're subscribing to the `$all` stream, or an event number if you're subscribing to an individual stream). You'll then get callbacks for existing events from the specified point onwards - the client transparently manages the switch between reading historical events and receiving live ones.

This mechanism allows you to build a subscriber which will get all events in a stream, even allowing for it going down, provided it has a way to record the last point it processed. In many cases, this can be easily achieved by storing the position transactionally with the work performed (for example, if you're persisting read models to SQL Server tables, you could store the last processed position in another table and use a database transaction to atomically write the result and the last processed position). This allows you to avoid distributed transactions, and to avoid having to make your subscribers idempotent.

## Catch-up Subscriptions

Catch-up subscriptions are made using a similar mechanism to live-only subscriptions.

### Single Stream

```
public EventStoreStreamCatchUpSubscription SubscribeToStreamFrom(string stream, int? fromEventNumberExclusive, bool resolveLinkTos, Action<EventStoreCatchUpSubscription, ResolvedEvent> eventAppeared, Action<EventStoreCatchUpSubscription, string, Exception> subscriptionDropped = null)
```

- **`stream`** – this is the name of the stream to which to subscribe.
- **`fromEventNumberExclusive`** – the exclusive stream number from which you want to subscribe - this would normally be the *last* stream number you processed. If you want to subscribe from the start of the stream, pass in `null` here.
- **`resolveLinkTos`** – this determines whether link events in the stream will be resolved or not (see the discussion above for how this affects the ResolvedEvent object given to the callback).
- **`eventAppeared`** – called whenever an event arrives.
- **`subscriptionDropped`** – called if the subscription drops.

The returned `EventStoreStreamCatchUpSubscription` can be used to stop and start the subscription as necessary.

### All Streams

Although similar, there is no global sequence number for events across all streams in the same way as there is for events in a single stream. Consequently, it is necessary to track the logical positions of events in the transaction file instead.

```
public EventStoreAllCatchUpSubscription SubscribeToAllFrom(Position? fromPositionExclusive, bool resolveLinkTos, Action<EventStoreCatchUpSubscription, ResolvedEvent> eventAppeared, Action<EventStoreCatchUpSubscription, string, Exception> subscriptionDropped = null)
```

- **`fromEventNumberExclusive` – the `Position` from which you want to subscribe – this would normally be the *last* position you processed. If you want to subscribe from the beginning of all events, pass in `Position.Start` here. The position is a tuple of the commit position and the prepare position of the event – to persist this it is sufficient to store both numbers, and to construct a Position from those numbers.
- **`resolveLinkTos`** – this determines whether link events in the stream will be resolved or not (see the discussion above for how this affects the ResolvedEvent object given to the callback).
- **`eventAppeared`** – called whenever an event arrives.
- **`subscriptionDropped`** – called if the subscription drops.

In the next part of this series, we’ll look at how you could use catch-up subscriptions to hook up denormalizers for creating read models.