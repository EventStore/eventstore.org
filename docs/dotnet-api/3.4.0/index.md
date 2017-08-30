---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Overview"
section: ".NET API"
version: "3.4.0"
pinned: true
---

The .NET Client API communicates with the Event Store over TCP, using length-prefixed serialized protocol buffers. The API allows for reading and writing operations, as well as for subscriptions to individual event streams or all events written.

## EventStoreConnection

The `EventStoreConnection` class is responsible for maintaining a full-duplex connection between the client and the Event Store server. `EventStoreConnection` is thread-safe, and it is recommended that only one instance per application is created.

All operations are handled fully asynchronously, returning either a `Task` or a `Task<T>`. If you need to execute synchronously, simply call `.Wait()` on the asynchronous version.

<span class="note">
To get maximum performance from the connection, it is recommended that it be used asynchronously.
</span>

## Quick Start

The code below shows how to connect to an Event Store server, write to a stream, and read back the events. For more detailed information, read the full pages for [Connecting to a Server](./connecting-to-a-server/), [Reading Events](./reading-events/) and [Writing to a Stream](./writing-to-a-stream/)

``` csharp
var connection =
    EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));

// Don't forget to tell the connection to connect!
connection.ConnectAsync().Wait();

var myEvent = new EventData(Guid.NewGuid(), "testEvent", false,
                            Encoding.UTF8.GetBytes("some data"),
                            Encoding.UTF8.GetBytes("some metadata"));

connection.AppendToStreamAsync("test-stream",
                               ExpectedVersion.Any, myEvent).Wait();

var streamEvents =
    connection.ReadStreamEventsForwardAsync("test-stream", 0, 1, false).Result;

var returnedEvent = streamEvents.Events[0].Event;

Console.WriteLine("Read event with data: {0}, metadata: {1}",
    Encoding.UTF8.GetString(returnedEvent.Data),
    Encoding.UTF8.GetString(returnedEvent.Metadata));
```