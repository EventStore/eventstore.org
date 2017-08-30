---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Reading Events"
section: ".NET API"
version: "3.4.0"
---

The client API can be used to read events from a stream starting from either end of the stream. There is a method for each direction. As well as one for reading a single event.

## Methods

### Reading a single event

```csharp
Task<EventReadResult> ReadEventAsync(string stream, int eventNumber, bool resolveLinkTos);
```

### Reading a specific stream forwards

```csharp
Task<StreamEventsSlice> ReadStreamEventsForwardAsync(string stream, int start, int count, bool resolveLinkTos)
```

### Reading a specific stream backwards

```csharp
Task<StreamEventsSlice> ReadStreamEventsBackwardAsync(string stream, int start, int count, bool resolveLinkTos)
```

### Reading all events forwards

```csharp
Task<AllEventsSlice> ReadAllEventsForwardAsync(Position position, int maxCount, bool resolveLinkTos);
```

### Reading all events backwards

```csharp
Task<AllEventsSlice> ReadAllEventsBackwardAsync(Position position, int maxCount, bool resolveLinkTos);
```

<span class="note">
These methods also have an additional optional parameter which allows you to specify the `UserCredentials` to use for the request. If none are supplied, the default credentials for the <code>EventStoreConnection</code> will be used (See <a href="../connecting-to-a-server/#user-credentials">Connecting to a Server - User Credentials</a>).
</span>

## StreamEventsSlice

The reading methods for individual streams each return a `StreamEventsSlice`, which is immutable. The available members on StreamEventsSlice are:

<table>
    <thead>
        <tr>
            <th>Member</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string Stream</code></td>
            <td>The name of the stream for the slice</td>
        </tr>
        <tr>
            <td><code>ReadDirection&nbsp;ReadDirection</code></td>
            <td>Either <code>ReadDirection.Forward</code> or <code>ReadDirection.Backward</code> depending on which method was used to read</td>
        </tr>
        <tr>
            <td><code>int FromEventNumber</code></td>
            <td>The sequence number of the first event in the stream</td>
        </tr>
        <tr>
            <td><code>int LastEventNumber</code></td>
            <td>The sequence number of the last event in the stream</td>
        </tr>
        <tr>
            <td><code>int NextEventNumber</code></td>
            <td>The sequence number from which the next read should be performed to continue reading the stream</td>
        </tr>
        <tr>
            <td><code>bool IsEndOfStream</code></td>
            <td>Whether or not this slice contained the end of the stream at the time it was created</td>
        </tr>
        <tr>
            <td><code>ResolvedEvent[] Events</code></td>
            <td>An array of the events read. See the description of how to interpret a <a href="#ResolvedEvent">Resolved Events</a> below for more information on this</td>
        </tr>
    </tbody>
</table>

## ResolvedEvent

When events are read from a stream (or received over a subscription) you will receive an instance of the `RecordedEvent` class packaged inside a `ResolvedEvent`.

Event Store supports a special type of event called Link Events. These events can be thought of as pointers to an event in another stream. 

In situations where the event you read is a link event, `ResolvedEvent` allows you to access both the link event itself, as well as the event it points to. 

The members of this class are as follows:

<table>
    <thead>
        <tr>
            <th>Member</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>RecordedEvent Event</code></td>
            <td>The event, or the resolved link event if this <code>ResolvedEvent</code> is a link event</td>
        </tr>
        <tr>
            <td><code>RecordedEvent Link</code></td>
            <td>The link event if this <code>ResolvedEvent</code> is a link event</td>
        </tr>
        <tr>
            <td><code>RecordedEvent&nbsp;OriginalEvent</code></td>
            <td>Returns the event that was read or which triggered the subscription. If this <code>ResolvedEvent</code> represents a link event, the link will be the <code>OriginalEvent</code>, otherwise it will be the event</td>
        </tr>
        <tr>
            <td><code>bool IsResolved</code></td>
            <td>Indicates whether this <code>ResolvedEvent</code> is a resolved link event</td>
        </tr>
        <tr>
            <td><code>Position? OriginalPosition</code></td>
            <td>The logical position of the <code>OriginalEvent</code></td>
        </tr>
        <tr>
            <td><code>string OriginalStreamId</code></td>
            <td>The stream name of the <code>OriginalEvent</code></td>
        </tr>
        <tr>
            <td><code>int OriginalEventNumber</code></td>
            <td>The event number in the stream of the <code>OriginalEvent</code></td>
        </tr>
    </tbody>
</table>

<span class="note">
To ensure that the Event Store server follows link events when reading, ensure the <code>ResolveLinkTos</code> parameter is set to true when calling read methods.
</span>

## RecordedEvent

`RecordedEvent` contains all the data about a specific event. Instances of this class are immutable, and expose the following members:

<table>
    <thead>
        <tr>
            <th>Member</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string EventStreamId</code></td>
            <td>The Event Stream that this event belongs to</td>
        </tr>
        <tr>
            <td><code>Guid EventId</code></td>
            <td>The Unique Identifier representing this event</td>
        </tr>
        <tr>
            <td><code>int EventNumber</code></td>
            <td>The number of this event in the stream</td>
        </tr>
        <tr>
            <td><code>string EventType</code></td>
            <td>The type of event this is (supplied when writing)</td>
        </tr>
        <tr>
            <td><code>byte[] Data</code></td>
            <td>A byte array representing the data of this event</td>
        </tr>
        <tr>
            <td><code>byte[] Metadata</code></td>
            <td>A byte array representing the metadata associated with this event</td>
        </tr>
        <tr>
            <td><code>bool IsJson</code></td>
            <td>Indicates whether the content was internally marked as json</td>
        </tr>
        <tr>
            <td><code>DateTime Created</code></td>
            <td>A datetime representing when this event was created in the system</td>
        </tr>
        <tr>
            <td><code>long CreatedEpoch</code></td>
            <td>A long representing the milliseconds since the epoch when the was created in the system</td>
        </tr>
    </tbody>
</table>

## Reading a single event

The `ReadSingleEventAsync` method reads a single event from a stream at a specified position. This is the simplest case of reading events, but is still useful for situations such as reading the last event in the stream to be used as a starting point for a subscription. This function accepts three parameters:

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string stream</code></td>
            <td>The stream to read from</td>
        </tr>
        <tr>
            <td><code>int eventNumber</code></td>
            <td>The event number to read (use <code>StreamPosition.End</code> to read the last event in the stream)</td>
        </tr>
        <tr>
            <td><code>bool&nbsp;resolveLinkTos</code></td>
            <td>Determines whether or not any link events encountered in the stream will be resolved. See the discussion on <a href="#ResolvedEvent">Resolved Events</a> for more information on this</td>
        </tr>
    </tbody>
</table>

This method returns an instance of `EventReadResult` which indicates if the read was successful, and if so the `ResolvedEvent` that was read.

## Reading a stream forwards

The `ReadStreamEventsForwardAsync` method reads the requested number of events in the order in which they were originally written to the stream from a nominated starting point in the stream. 

The parameters are:

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string Stream</code></td>
            <td>The name of the stream to read</td>
        </tr>
        <tr>
            <td><code>int start</code></td>
            <td>The earliest event to read (inclusive). For the special case of the start of the stream, the constant <code>StreamPosition.Start</code> should be used</td>
        </tr>
        <tr>
            <td><code>int count</code></td>
            <td>The maximum number of events to read in this request (assuming that many exist between the start specified and the end of the stream)</td>
        </tr>
        <tr>
            <td><code>bool&nbsp;resolveLinkTos</code></td>
            <td>Determines whether or not any link events encountered in the stream will be resolved. See the discussion on <a href="#ResolvedEvent">Resolved Events</a> for more information on this</td>
        </tr>
    </tbody>
</table>

### Example: Reading an entire stream forwards from start to end

This example uses the `ReadStreamEventsForwardAsync` method in a loop to page through all events in a stream, reading 200 events at a time in order to build a list of all the events in the stream.

```csharp
var streamEvents = new List<ResolvedEvent>();

StreamEventsSlice currentSlice;
var nextSliceStart = StreamPosition.Start;
do
{
    currentSlice = 
    _eventStoreConnection.ReadStreamEventsForward("myStream", nextSliceStart,
                                                  200, false)
                                                  .Result;

    nextSliceStart = currentSlice.NextEventNumber;

    streamEvents.AddRange(currentSlice.Events);
} while (!currentSlice.IsEndOfStream);
```
<span class="note">It is unlikely that client code would need to actually build a list in this manner. It is far more likely that events would be passed into a left fold in order to derive the state of some object as of a given event.</span>

## Reading a stream backwards

The `ReadStreamEventsBackwardAsync` method reads the requested number of events in the reverse order from that in which they were originally written to the stream from a specified starting point.

The parameters are:

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string Stream</code></td>
            <td>The name of the stream to read</td>
        </tr>
        <tr>
            <td><code>int start</code></td>
            <td>The latest event to read (inclusive). For the end of the stream use the constant <code>StreamPosition.End</code></td>
        </tr>
        <tr>
            <td><code>int count</code></td>
            <td>The maximum number of events to read in this request (assuming that many exist between the start specified and the start of the stream)</td>
        </tr>
        <tr>
            <td><code>bool&nbsp;resolveLinkTos</code></td>
            <td>Determines whether or not any link events encountered in the stream will be resolved. See the discussion on <a href="#ResolvedEvent">Resolved Events</a> for more information on this</td>
        </tr>
    </tbody>
</table>

## Reading all events

In addition to the individual streams which you create, Event Store also allows you to read events accross all streams using 
the `ReadAllEventsForwardAsync` and `ReadAllEventsBackwardsAsync` methods. These work in largely the same way as the regular read methods, but use instance of the global logfile `Position` to reference events rather than the simple integer stream position described previously.

They also return an `AllEventsSlice` rather than a `StreamEventsSlice` which is the same except it uses global `Position`s rather than stream positions.

### Example: Reading all events forward from start to end

```csharp
var allEvents = new List<ResolvedEvent>();

AllEventsSlice currentSlice;
var nextSliceStart = Position.Start;

do
{
    currentSlice =
        connection.ReadAllEventsForwardAsync(nextSliceStart, 200, false).Result;

    nextSliceStart = currentSlice.NextPosition;

    allEvents.AddRange(currentSlice.Events);
} while (!currentSlice.IsEndOfStream);
```