The **when()** function provides for applying a function to a given event type. It operates through the use of a pattern match. 

When can be applied to any selector of events.

The use of this pattern match forms the core of the left fold discussed in [Projections Theory](Projections-Theory). The behaviour can be seen in the following query

```
append foo MyType1 {'foo' : 'data1'}

append foo MyType2 {'foo' : 'data2'}

append foo MyType3 {'foo' : 'data3'}

append foo MyType1 {'foo' : 'data4'}

q fromStream('foo').
     when({
        $init   : function() { return { mt1 : 0, mt3 : 0}},
        MyType1 : function(s,e) { return { mt1 : s.mt1 + 1, mt3 : s.mt3}},
        MyType3 : function(s,e) { return { mt1 : s.mt1, mt3 : s.mt3 + 1}}
     })

```

```
ouro@ouroboros:>cat projection.txt | esquery
No server set defaulting to http://127.0.0.1:2113/
es:> append foo MyType1 {'foo' : 'data1'}

Succeeded.
es:> append foo MyType2 {'foo' : 'data2'}

Succeeded.
es:> append foo MyType3 {'foo' : 'data3'}

Succeeded.
es:> append foo MyType1 {'foo' : 'data4'}

Succeeded.
es:> q fromStream('foo').
     when({
        $init   : function() { return { mt1 : 0, mt3 : 0}},
        MyType1 : function(s,e) { return { mt1 : s.mt1 + 1, mt3 : s.mt3}},
        MyType3 : function(s,e) { return { mt1 : s.mt1, mt3 : s.mt3 + 1}}
     })
Query Completed in: 00:00:01.4103795
0@$projections-aa2cf20f-6934-4a81-96e1-db2256fb4b25-result
{
  "mt1": 2,
  "mt3": 1
}

Query Completed
```

This query has three pattern matches inside of it. 

```js
     when({
        $init   : function() { return { mt1 : 0, mt3 : 0}},
        MyType1 : function(s,e) { return { mt1 : s.mt1 + 1, mt3 : s.mt3}},
        MyType3 : function(s,e) { return { mt1 : s.mt1, mt3 : s.mt3 + 1}}
     })
```

We will discuss the $init shortly. The other two are matching on event types. If we were to look at the stream "foo". We inserted 4 events into it.

```
es:> q fromStream('foo')

3@$projections-c2110a68-3818-4eb6-beed-257315d55cf8-result
MyType1 {
  "foo": "data4"
}
2@$projections-c2110a68-3818-4eb6-beed-257315d55cf8-result
MyType3 {
  "foo": "data3"
}
1@$projections-c2110a68-3818-4eb6-beed-257315d55cf8-result
MyType2 {
  "foo": "data2"
}
0@$projections-c2110a68-3818-4eb6-beed-257315d55cf8-result
MyType1 {
  "foo": "data1"
}
```

The when projection above assigns functions to various event types. In particular when it finds a MyType1 it will add to the mt1 counter where as when it hits a MyType3 it will add to the mt3 counter. Remember as discussed in [Projections Theory](Projections-Theory) these methods are combined to create a left-fold over the event stream.

In this particular case the order of calling would be MyType1(MyType2(MyType1(init())) based on the order of the events in the event stream.

###Special Pattern Matches

There are some special pattern matches that can be used.

$init defines a match that is run before your code other code is executed. This function is extremely valuable for initializing some piece of state that will then be passed through the other functions. Often times this can negate the need for large amount of code checking to see if values have been defined on your state.

$any defines a match that matches any event type. This cannot be used in conjunction with event type matches within the when. This match is mostly useful in things such as [Indexing Projections](Projections-Indexed-Projections) or when you are focused on counts.

###Usages with Indexing

When running a when() pattern match on a fromAll() selector the system may convert your query from being a fromAll() to using an index to only see the events needed for the pattern match. If for example you were to use :

```
query fromAll()
	    .when({
             Fooed  : function(s,e) {return 1},
             Barred : function(s,e) {return 0} 
        })
```

This query can be optimized away from having to look at every event through the use of indexes. It is functionally equivalent to:

```
query fromStreams(['$et-Barred', '$et-Fooed'])
	    .when({
             Fooed  : function(s,e) {return 1},
             Barred : function(s,e) {return 0} 
        })
```

As the second query is only looking at two streams in the system (that are maintained by a built in projection) it will be faster than the first in most circumstances.

You can read more about this in the section discussing [when optimizations](Projections-when-Optimizations)

![Google analytics pixel](https://gaproxy-1.apphb.com/UA-40176181-1/Wiki/Projections-when)
