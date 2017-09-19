---
title: "Applications and IEvent"
date: 2012-11-21T12:09Z
author: "James Nugent"
layout: blog-post
---

We had a question on Twitter about whether events stored in the Event Store have to implement any interfaces or inherit from a base class or similar. Fundamentally, the Event Store doesn’t care what you store inside it - you are responsible for serialization. The remainder of this post talks about the TCP Client API.

The reading methods on EventStoreConnection return an EventStreamSlice object, which contains an array of RecordedEvent objects (which are also used for the subscription callbacks). The important part of RecordedEvent looks like this:

```
public class RecordedEvent
{
    public readonly string EventStreamId;

    public readonly Guid EventId;
    public readonly int EventNumber;

    public readonly string EventType;

    public readonly byte[] Data;
    public readonly byte[] Metadata;
...
```

The writing methods take an enumerable of IEvent, which looks like the following:

```
public interface IEvent
{
    Guid EventId { get; }
    string Type { get; }
    bool IsJson { get; }

    byte[] Data { get; }
    byte[] Metadata { get; }
}
```

The `Data` field should contain a serialized version of the event. If you serialize as JSON and set `IsJson` to true, the internally hosted projections will be able to process the event.

Although it may be tempting to use the CLR Type Name in the `Type` field, it's worth considering that projections use that type name in the `when()` construct, so it’s probably better to use a friendlier name there, and include the CLR type name as metadata or as part of the serialization.

If you’re using the Event Store for event sourcing, these details will likely be encapsulated by your repository.