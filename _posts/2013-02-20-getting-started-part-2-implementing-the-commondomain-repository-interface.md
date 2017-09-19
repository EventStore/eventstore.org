---
title: "Getting Started: Part 2 – Implementing the CommonDomain repository interface"
date: 2013-02-20T17:56Z
author: "James Nugent"
layout: blog-post
---

<b>Updates: August 31, 2016</b>
<ul>
	<li>Jon Oliver has not maintained CommonDomain for some years now.</li>
	<li>CommonDomain it turns out has various pain points which make it less than ideal for production usage. In fact, we recommend not using _any_ framework or library as part of your domain model, and building the few lines of code ineeded to implement a left fold yourself - partly to ensure understanding and partly to keep your domain model dependency-free.</li>
</ul>

<strike>Jon Oliver’s</strike>* <strike>excellent</strike>** [CommonDomain](https://github.com/joliver/CommonDomain) project has been around for some time, and many developers have built systems either using it directly or using it as inspiration for their own Aggregate + Event Sourcing base classes and repository interfaces. In this post, we’ll look at implementing the `IRepository` interface using the Event Store for storage.

The purpose of this is to provide a sample implementation that you can customise according to the specific needs of your system rather than to provide framework code - for this reason we don’t intend to provide a NuGet package of it! The code, along with some integration tests and the necessary supporting files, are available in the [GitHub repository for this blog series](https://github.com/eventstore/getting-started-with-event-store).

## The Interface

The interface we’re looking to implement is this:

```csharp
public interface IRepository
{
    TAggregate GetById(Guid id) where TAggregate : class, IAggregate;
    TAggregate GetById(Guid id, int version) where TAggregate : class, IAggregate;
    void Save(IAggregate aggregate, Guid commitId, Action<IDictionary<string, object>> updateHeaders);
}
```

It’s contained in the CommonDomain.Persistence assembly which is available either through NuGet or by building [from source](https://github.com/joliver/CommonDomain). Bear in mind that the NuGet package is ILMerged with Jon Oliver’s own Event Store - our repository contains the CommonDomain packages built to stand alone.

## Dependencies

Before we jump into reading or writing, let’s take a look at our dependencies. The constructor in our implementation looks like this:

```csharp
public geteventstoreRepository(EventStoreConnection eventStoreConnection, Func<Type, Guid, string> aggregateIdToStreamName)
{
    _eventStoreConnection = eventStoreConnection;
    _aggregateIdToStreamName = aggregateIdToStreamName;
}
```

As expected, we need a reference to an `EventStoreConnection` which is provided as part of the Event Store Client API. The more interesting dependency is the `aggregateIdToStreamName` Func, which is responsible for taking the CLR Type of the aggregate and the Guid used to identify it, and producing a stream name.

Stream names in the Event Store are strings, and we have the convention which can be used whereby stream names of the format `category-rest` use the prefix before the hyphen as the event category. This can be useful later when using projections (Greg will be covering using them in his [blog series on projections](/blog/20130212/projections-1-theory)).

Because the category name is used from JavaScript, the default implementation of `aggregateIdToStreamName` converts the name to camel case - so an aggregate of type MyTestAggregate with an ID of `ffe312b9-624a-4a2a-9665-e9ae27dd1d7d` ends up with the stream name `myTestAggregate-ffe312b9-624a-4a2a-9665-e9ae27dd1d7d`.

## Writing

Our implementation of the save method looks like this:

```csharp
public void Save(IAggregate aggregate, Guid commitId, Action<IDictionary<string, object>> updateHeaders)
{
    var commitHeaders = new Dictionary<string, object>
    {
        {CommitIdHeader, commitId},
        {AggregateClrTypeHeader, aggregate.GetType().AssemblyQualifiedName}
    };
    updateHeaders(commitHeaders);

    var streamName = _aggregateIdToStreamName(aggregate.GetType(), aggregate.Id);
    var newEvents = aggregate.GetUncommittedEvents().Cast<object>().ToList();
    var originalVersion = aggregate.Version - newEvents.Count;
    var expectedVersion = originalVersion == 0 ? ExpectedVersion.NoStream : originalVersion;
    var eventsToSave = newEvents.Select(e => ToEventData(Guid.NewGuid(), e, commitHeaders)).ToList();

    if (eventsToSave.Count < WritePageSize)
    {
        _eventStoreConnection.AppendToStream(streamName, expectedVersion, eventsToSave);
    }
    else
    {
        var transaction = _eventStoreConnection.StartTransaction(streamName, expectedVersion);

        var position = 0;
        while (position < eventsToSave.Count)
        {
            var pageEvents = eventsToSave.Skip(position).Take(WritePageSize);
            transaction.Write(pageEvents);
            position += WritePageSize;
        }

        transaction.Commit();
    }

    aggregate.ClearUncommittedEvents();
}

private static EventData ToEventData(Guid eventId, object evnt, IDictionary<string, object> headers)
{
    var data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(evnt, SerializerSettings));

    var eventHeaders = new Dictionary<string, object>(headers)
    {
        {
            EventClrTypeHeader, evnt.GetType().AssemblyQualifiedName
        }
    };
    var metadata = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(eventHeaders, SerializerSettings));
    var typeName = evnt.GetType().Name;

    return new EventData(eventId, typeName, true, data, metadata);
}
```

Much of this code is straightforward, although there are a few points of interest:

- We save the Commit ID in the metadata for every event saved.
- The CLR type of the aggregate which produced the event as a header is stored as a header. This isn’t strictly speaking necessary - you might choose to just store the type name without the assembly qualification, for example, or may choose not to bother storing this at all.
- We use the `Action&lt;IDictionary&lt;string, object&gt;&gt;` to add any custom headers.
- `_aggregateIdToStreamName` is used to work out which stream we should write to.
- The expected version of the aggregate is calculated from the original version (as stored in `aggregate.Version`) and the number of events to be saved. This allows optimistic concurrency to work inside the Event Store. If we don’t expect the stream to exist, we use `ExpectedVersion.NoStream`.
- We switch which writing methods we use on the Event Store Client API according to whether or not the number of events we have to same exceeds the page size threshold we choose (500 in this case). Events written using AppendToStream will be written atomically, as we need here. If we'd need more than one call to stay within our page size, we use the `connection.StartTransaction, transaction.Write, transaction.Commit` set of methods to ensure the events are written atomically.
- Events are serialized without the CLR type information embedded in the JSON (this is set up in the SerializerSettings). Instead, the CLR type name for each event is saved as metadata with it.

## Reading

The two reading methods get the latest version of an aggregate or a specific version. The implementation looks like this:

```csharp
public TAggregate GetById<TAggregate>(Guid id) where TAggregate : class, IAggregate
{
    return GetById<TAggregate>(id, int.MaxValue);
}

public TAggregate GetById<TAggregate>(Guid id, int version) where TAggregate : class, IAggregate
{
    if (version <= 0)
        throw new InvalidOperationException("Cannot get version <= 0");


    var streamName = _aggregateIdToStreamName(typeof(TAggregate), id);
    var aggregate = ConstructAggregate<TAggregate>();

    var sliceStart = 1; //Ignores $StreamCreated
    StreamEventsSlice currentSlice;
    do
    {
        var sliceCount = sliceStart + ReadPageSize <= version
                            ? ReadPageSize
                            : version - sliceStart + 1;

        currentSlice = _eventStoreConnection.ReadStreamEventsForward(streamName, sliceStart, sliceCount, false);

        if (currentSlice.Status == SliceReadStatus.StreamNotFound)
            throw new AggregateNotFoundException(id, typeof (TAggregate));

        if (currentSlice.Status == SliceReadStatus.StreamDeleted)
            throw new AggregateDeletedException(id, typeof (TAggregate));

        sliceStart = currentSlice.NextEventNumber;

        foreach (var evnt in currentSlice.Events)
            aggregate.ApplyEvent(DeserializeEvent(evnt.OriginalEvent.Metadata, evnt.OriginalEvent.Data));
    } while (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream);

    if (aggregate.Version != version && version < Int32.MaxValue)
        throw new AggregateVersionException(id, typeof (TAggregate), aggregate.Version, version);                

    return aggregate;
}

private static TAggregate ConstructAggregate<TAggregate>()
{
    return (TAggregate)Activator.CreateInstance(typeof(TAggregate), true);
}
```

The overload of the method for getting the latest version simply calls the overload responsible for getting a specific version with the parameter `Int32.MaxValue`. If we wanted to change the interface, we could use an `int?` here as well.

In the specific case version, the following is worth noting:

- We get a “fresh” aggregate instance from the `ConstructAggregate<TAggregate>` method. Instead, we could delegate rebuilding to another object, but this seems like the simplest approach until we have deal with snapshots.
- We choose to start at event 1 rather than event 0 when reading. This is because event 0 is always the `$StreamCreated` event, for which we currently have no purpose here. If the stream was created explicitly and (say) had metadata on it, we might want to revisit this.
- We loop through reading a page at a time until the end of the stream or until we reach the desired version, applying events to the aggregate as they are read.
- The reconstituted aggregate version is compared against the requested version when we finish reading - we throw an exception if they do not match.
- We throw `AggregateNotFoundException` and `AggregateDeletedException` if the stream is not found or is found to have been deleted, respectively.

There are a number of areas we haven’t considered here – snapshots are one. Practically, the memento which forms an aggregate snapshot can be stored in another stream which is created explicitly with `$maxCount = n`, where `n` is the number of snapshots which must be kept. If there’s any demand for it, we’ll look at some sample code for that in a future post.

Part 3 of this series will cover hooking up read models using a subscription which catches up to the last processed event.

*Edited on Thursday, February 21st 2013 to add better error handling and fix a bug which could cause an infinite loop in the sample code.*
