---
title: "Catch-up subscriptions with the Event Store"
date: 2013-07-07T14:51Z
author: "James Nugent"
layout: blog-post
category: 'Tutorials'
---

We have had many questions about how to use the catch-up subscriptions in the C# Event Store Client API. In this post I'll build out a simple example of a console application which receives a callback each time an event is written to the built-in statistics stream.

Contrary to what some have thought, catch-up subscriptions are implemented as part of the client, and have been available in the client API version 1.1.0 which has been on NuGet for some time. As we’re coming up to a big release which changes some aspects of the client API, I'll build out this sample for both the version currently available on NuGet, and then in the next post for the version which can be built from the development branch and will shortly be available as part of version 2 of Event Store.

We’ll first take a look at using the current stable release, which is server version 1.0.1 and client API 1.1.0.

## Server Setup

In order to make the server generate statistics at a rate that’s interesting to us (the default is a sample every 30 seconds), we'll run it like this:

```
EventStore.SingleNode.exe --db .\catchupsubscriptions --stats-period-sec 2
```

This will set up a new database in `.\catchupsubscriptions`, and write an event to the statistics stream every two seconds. Since we’re not specifying an IP address to bind to, the Event Store will bind to the loopback address on the default ports of `1113` for TCP and `2113` for HTTP. Also, since we’re running a version 1 server and not specifying `--run-projections`, we won’t be able to use them, which is fine for our current purposes.

The statistics stream will be named `$stats-127.0.0.1:2113`.

## Client Setup

For our client we’ll use a straightforward console application targeting .NET 4.0, remove all the unused references, and add the EventStore.Client package (version 1.1.0) from NuGet. To avoid dependency issues, the version of `EventStore.Client.dll` which comes in the NuGet package has the appropriate version of `protobuf-net.dll` merged.

*Note: methods used for connecting are slightly different in version 2, as we’ll see in the next post. This covers client version 1.1.0.*

To start with, we’ll need to connect to the Event Store. The following code will connect to the local Event Store we just started:

```csharp
var connection = EventStoreConnection.Create();
connection.Connect(new IPEndPoint(IPAddress.Loopback, 1113));
```

Next let’s subscribe to the statistics stream, and write a method which will make use of the information in each event to print the sequence number and event type to the console.

To subscribe, we'll use the following method (in our `Main` method for now):

```csharp
connection.SubscribeToStream("$stats-127.0.0.1:2113", false, EventAppeared, SubscriptionDropped);
```

The two callbacks `EventAppeared` and `SubscriptionDropped` have the following
signatures:

```csharp
private static void SubscriptionDropped(EventStoreSubscription subscription, string reason, Exception exception)
{
}

private static void EventAppeared(EventStoreSubscription subscription, ResolvedEvent resolvedEvent)
{
}
```

`SubscriptionDropped` is called in a number of circumstances:

- if the server is stopped
- if the client becomes disconnected from the server
- if the client cannot service the events coming over the subscription quickly
  enough, and the server defensively drops it to avoid filling up buffers
  unnnecessarily.

However, it doesn’t have to be implemented, so we’ll leave it empty for now. In real-world applications you’ll probably want to try some reconnection strategy here.

`EventAppeared` is called whenever an event is received over the subscription (i.e. when it is written at the server).

Let’s add some code to our `EventAppeared` handler to print to the console when we receive an event:

```csharp
private static void EventAppeared(EventStoreSubscription subscription, ResolvedEvent resolvedEvent)
{
   var receivedEvent = resolvedEvent.OriginalEvent;
   Console.WriteLine("{0:D4} - {1}", receivedEvent.EventNumber, receivedEvent.EventType);
}
```

Now, if we add a `Console.ReadLine()` to the end of our `Main` method to stop the program from terminating, we'll see the sequence numbers and event types appear on the console – but from the point we subscribed onwards.

However, that wasn’t really the aim – what we wanted to do was use a catch-up subscription in order to receive previous events from some point in the stream before getting live ones over the subscription. So let's change our subscription call:

```csharp
connection.SubscribeToStreamFrom("$stats-127.0.0.1:2113", StreamPosition.Start, false, EventAppeared);
```

The extra parameter here is a nullable int which specifies the sequence number
in the stream from which you want the subscription to start. In our case we
want to start at the beginning of the stream, so we'll use the constant
`StreamPosition.Start`. Our callback signature changes slightly:

```csharp
private static void EventAppeared(EventStoreCatchUpSubscription subscription, ResolvedEvent resolvedEvent)
```

However, the implementation can remain the same after making that change. Running this, we now see the sequence numbers from 0 to the current value appear very quickly (reading is fast!), and following that, new events will appear as they are written by the server.

## Subscribing to All streams instead

If you need to subscribe to the `$all` stream instead of an individual stream, you’ll need to supply a `Position` instead of a sequence number. This is a pair of numbers representing the logical commit and prepare positions of the event respectively. Otherwise this is the same.

In the next post we’ll look at doing this with the changes made for 2.0.0 (it’s not actually all that different, just has a few things tidied up).