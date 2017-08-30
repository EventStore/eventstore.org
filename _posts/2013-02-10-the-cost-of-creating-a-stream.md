---
title: "The cost of creating a stream"
date: 2013-02-10T14:57
author: "Greg Young"
layout: blog-post
---

Travelling and watching people using the Event Store I have seen many with a confusion about how streams work. In particular people are worried about the cost of creating a new stream in the system. The Event Store is buit with an expectation that you will have many (**millions!**) streams.

When people talk about doing Event Sourcing for most models they end up with a stream for every *instance* of an aggregate. Many have been confused into wanting to build a stream for every type of aggregate or for every type of event. This causes a few issues.

The first is how do I read back the events then for a specific instance of the aggregate? Many are putting in if statements when they read back. This becomes very inefficient. A second issue is that concurrency is provided on the stream level. As an example if you put all instances into a single stream, writing from one machine to one instance can conflict with another server writing to a different instance.

In the Event Store streams are like documents in a document database. They are extremely cheap to create. The database assumes that you will have many many millions of streams. Also like in a document database streams are the parition point. With many millions of streams they can easily be sharded across a number of servers.

Generally when people are wanting only a few streams its because they want to read things out in a certain way for a particular type of reader. This can be done in other ways. Internally the Event Store is essentialy a topic based pub/sub. What you can do is repartition your streams utilizing projections to help provide for a specific reader. As an example let's say that a reader was interested in all the InventoryItemCreated and InventoryItemDeactivated events but was not interested in all the other events in the system. Supporting this stream when we have the events in many millions of streams can still be done.

To do this we will create a projection to reindex the streams. In particular we will use the linkTo method to create an index in the system.

```
fromAll().when( {
'InventoryItemCreated' : function(s,e) {linkTo("somestream", e)},
'InventoryItemDeactivated' : function(s,e) {linkTo("somestream", e)}
})
```

This projection will create a new stream called "somestream" and emit all of the InventoryItemCreated and InventoryItemDeactivated events into it. The subscriber who then wants all of these events could then read from somestream in order to get all of them (even though they are in millions of streams). This is however a very specific solution and a better more general one exists.

```
fromAll().whenAny(function(s,e) {linkTo("type-" + e.type, e)})
```

This will create N streams (one for each type of event in the system) with all the events of that event type in the stream. These streams are named type-{typename} as an example we could go to the stream type-InventoryItemDeactivated and all events from all streams of type InventoryItemDeactivated will be in the stream. *Note there is the "bytype projection built into the Event Store that does this to $et-{typename} that is optimized.*

If we then wanted to have a subscriber that was interested in the two event types we could do a “join” between the two streams. In the javascript projecton language this would be implemented as

```
fromStreams(["type-InventoryItemDeactived", "type-InventoryItemCreated"]).when( ... )
```

This will join our two streams that contain the events based upon type and create a single stream that represents all of the events (regardless of what partition they were originally written to).

Its important to remember that the way you write to your streams does not have to match the way you want to read from your streams. You can quite easily choose a different parititoning for a given reader.