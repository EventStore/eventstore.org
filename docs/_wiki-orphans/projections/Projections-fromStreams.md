The **fromStreams([])** selector takes events from multiple streams and joins them into a single stream. When joining the streams it will reorder the events into the correct order. fromStreams takes an array of string representing the streams you wish to join.

Usage of the fromStreams method can be seen with the following set of instructions in the [esquery tool](esquery)

```
append foo1 MyType {'foo1' : 'data1'}

append foo MyType {'foo' : 'data2'}

append foo1 MyType {'foo1' : 'data3'}

append foo MyType {'foo' : 'data4'}

q fromStreams(['foo', 'foo1'])

```

```
ouro@ouroboros:>cat projection.txt | e
squery
No server set defaulting to http://127.0.0.1:2113/
es:> append foo1 MyType {'foo1' : 'data1'}

Succeeded.
es:> append foo MyType {'foo' : 'data2'}

Succeeded.
es:> append foo1 MyType {'foo1' : 'data3'}

Succeeded.
es:> append foo MyType {'foo' : 'data4'}

Succeeded.
es:> q fromStreams(['foo', 'foo1'])
Query Completed in: 00:00:01.5627793
3@$projections-cb6d830d-7078-416a-953f-1e4036ba4ed4-result
{
  "foo": "data4"
}
2@$projections-cb6d830d-7078-416a-953f-1e4036ba4ed4-result
{
  "foo1": "data3"
}
1@$projections-cb6d830d-7078-416a-953f-1e4036ba4ed4-result
{
  "foo": "data2"
}
0@$projections-cb6d830d-7078-416a-953f-1e4036ba4ed4-result
{
  "foo1": "data1"
}

Query Completed
```

As can be seen the events in stream 'foo' and the events in stream 'foo1' are joined and put back into the appropriate order. The ordering of the events is deterministic for historical queries. In the consistently hashed version however in live mode it is not always possible to get the events in the perfect order.

For this use case there is an option that can be set on the projection. You can set

```js
    options({
                reorderEvents: true,
                processingLag: 3000
    });
```

The processing lag is the period of time in ms to wait in live mode before allowing an event to pass through (in other words the amount of time you are willing to buffer in order to provide ordering). This is especially necessary when the two streams end up residing on two physical nodes though there is no possible way to ensure that events are always received in the appropriate order.