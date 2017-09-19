---
title: "Projections 1: Theory"
date: 2013-02-12T14:00Z
author: "Greg Young"
layout: blog-post
---

Over at [eventstore.org](/) we have 1.0’d the Event Store as an Event Store (i.e. storing/retrieving events/multinode version/etc) but in the process we did not release projections. They are still marked as experimental. Projections are however getting close to ready so its time to write a bit about them as the official documentation takes shape.

Through the series we will get fairly deep into their usage but for many the best way to understand them to understand the underlying theory so let’s start there.

## Functions

When we talk about a projection off of an event stream basically what we are describing is running a series of functions over the stream. We could as our simplest possible projection have a projection that runs through all of the events in the system (in order) passing current state from one function to the next. The simplest of these could be to count how many events there are.

```javascript
var count = function(state, event) {
	return state + 1;
}
```

Then to run it across all of the events (let’s imagine we had three) in our system we would end up with a pattern like:

```javascript
var result = count(count(count(count, 0), event1), event2), event3)
```

This operation is known in the functional world as a [higher order function -> left-fold](http://en.wikipedia.org/wiki/Fold_(higher-order_function)). It is a very powerful construct that is useful in solving many problems. **When we talk about Event Sourcing, current state is a left-fold of previous behaviours (events represent the behaviours)**.

Projections at their heart allow for the specializing of a generalized function. Their underlying model is that of a left-fold. Looking at the above left fold there are a couple of pieces that we could possibly change. The generic version of this function would look something like:

```javascript
var result = transform(f(f(f(initial()), e), e), e)
```

Let's discuss briefly what the three main parts of this function are.

- `f(state, event) => state` is the function that is run over the series of events.
- `transform(state) => result` is a function that can transform the state to the form of result you want to receive
- `initial() => state` returns the initial state you want passed into your left-fold.

Taking one example (don’t worry we will go through more in later posts!): `f(state, event) => state` gets specialized through a pattern match:

```javascript
var f1 = function(state,event) {}

when({
	$any : f //runs for all
})
```

or

```javascript
var f1 = function(state,event) {}
var f2 = function(state,event) {}

when({
	Something : f1, //match all Something
	SomethingElse f2: //match all SomethingElse
}
```

To see the differences between the two, let’s imagine that we had a stream of events.

```
Something
SomethingElse
Something
```

The first would call as:

```javascript
f1(f1(f1(nil, Something), SomethingElse),Something)
```

The second would call as

```javascript
f1(f2(f1(nil, Something), SomethingElse),Something)
```

If we were to change the stream to:

```
Something
SomethingElse
SomethingElse
```

The second would end up as

```javascript
f2(f2(f1(nil, Something), SomethingElse),SomethingElse)
```

Again don’t worry too much about the details. We will have a whole post on `when` and pattern matching

## Event Selection

The second part of how projections work theoretically is the controlling of which events get passed to which definition. In our first example we passed all events in the system through a single left-fold. While many projections due in fact work exactly this way many are only interested in certain events not all events in the entire event store.

`fromAll()` would read all of the events in the entire event store. `fromStream('stream')` tells projections to take whatever definition you have and run it against only the events within the stream 'stream'. Where as `fromStreams(['s1', 's2', 's3'])` joins the events from three streams and then runs the left-fold of the resulting stream.

Don’t worry if you don’t completely *get* projections after this post, there is a lot to them and we will be delving into a lot more detail and use cases of them. Overall however projections have a relatively simple underlying theory associated with them. Hopefully by understanding the underlying theory it will make the rest of the posts in the series easier to understand.