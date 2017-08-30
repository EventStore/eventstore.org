---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Types of Subscriptions"
section: "Introduction"
version: "3.0.2"
---
When using the Event Store client APIs, clients can subscribe to a stream and be notified when new events are written to that stream. There are three types of subscription which are available, all of which can be useful in different situations.

## Volatile Subscriptions

This kind of subscription calls a given function for events written after the subscription is established.

For example, if a stream has 100 events in it when a subscriber connects, the subscriber can expect to see event number 101 onwards until the time the subscription is closed or dropped.

## Catch-Up Subscriptions

This kind of subscription specifies a starting point, in the form of an event number or transaction file position. The given function will be called for events from the starting point until the end of the stream, and then for subsequently written events.

For example, if a starting point of 50 is specified when a stream has 100 events in it, the subscriber can expect to see events 51 through 100, and then any events subsequently written until such time as the subscription is dropped or closed.

## Persistent Subscriptions

<span class="note">Persistent subscriptions only exists in version 3.2.0 and above.</span>

This kind of subscriptions supports the "competing consumers" messaging pattern. The subscription state is stored server side in the Event Store and allows for at-least-once delivery guarantees across multiple consumers on the same stream.

It is possible to have many groups of consumers compete on the same stream, with each group getting an at-least-once guarantee.

## Use cases

Subscriptions have many use cases. For example, when building an event-sourced system adhering to the CQRS pattern, the denormalizers creating query models can use catch-up subscriptions to have events pushed to them as they are written to the Event Store. 

Volatile subscriptions can be used where it is important to be notified with minimal latency of new events which are written, but where it is not necessary to process every event.

Persistent subscriptions can be used when it is desirable to distribute messages to many workers.