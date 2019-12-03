---
title: "Projections 8: internal indexing"
date: 2013-03-09T16:04Z
author: "Greg Young"
layout: blog-post
category: "Tutorials"
tags: ["Event Store","Projections","Event sourcing"]
---

In the [last post](/blog/20130309/projections-7-multiple-streams) we introduced the new concept of `fromStreams([])` that will join multiple streams into a single stream for your fold to be run against. We also introduced options and two options that can be used to control the re-ordering behaviour in a distributed environment. In this post we are going to look at how this concept is used internally in the Event Store in order to provide indexing of queries.

Let's propose a scenario where you have 80,000,000 events in the Event Store. You wish to write a query that looks like:

```javascript
fromAll().
    when({
        Foo: function(s,e) { ... },
        Bar: function(s,e) { ... },
        Baz: function(s,e) { ... } 
    });
```

In the store there are a total of 500 `Foo` events, 100 `Bar` events, and 1000 `Baz` events. This query would be very very expensive to run as it would need to look through 80,000,000 events in order to run on the 1600 events that you are interested in (the equivalent of a table scan in sql). This query though can (and is) indexed internally!

If you look in options there is another option called "useEventIndexes" that defaults to true. If you enable this option, this query will only look at 1600 events and ignore the other 80,000,000! 

This works using the same principles we have been learning in the blog post series. If you look there is a special projection in the Event Store called `$by_event_type`. This projection is at this point implemented internally but if it were written in JavaScript it would look something like:

```javascript
fromAll().
    when({
        $any : function(s,e) { linkTo("$et-" + e.type, e); }
    });
```

In other words the projection will create a stream per event type named `$et-{eventtype}` that contains links to all events of that type. This standard projection can then be used in conjunction with other projections to provide indexing. Consider our original projection:

```javascript
fromAll().
    when({
        Foo: function(s,e) { ... },
        Bar: function(s,e) { ... },
        Baz: function(s,e) { ... } 
    });
```

This can now be converted into an indexed projection using `fromStreams()`. We can convert it into:

```javascript
fromStreams(["$et-Foo", "$et-Bar", "$et-Baz"]).
    when({
        Foo: function(s,e) { ... },
        Bar: function(s,e) { ... },
        Baz: function(s,e) { ... } 
    });
```

This is done by default. It will then read only from the three joined streams listed! not from all of the events in the system, in our example it will only see 1600 events, not the 80,000,000 that exist. This is how you can combine some of the ideas we have been looking at to provide indexing in various forms for your projections.