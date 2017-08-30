#Underlying Theory of Projections

Projections have a huge amount of theory underlying them. For many people understanding the theory is a fast way of learning. In this document we will be looking through the underlying theory in how the projection query model works.

###Functions

When we talk about a projection off of an event stream basically what we are describing is running a series of functions over the stream. We could as our simplest possible projection have a projection that runs through all of the events in the system (in order) passing current state from one function to the next. The simplest of these could be to count how many events there are.

```js
var count = function(state, event) {
   return state + 1;
}
```

Then to run it across all of the events (let’s imagine we had three) in our system we would end up with a pattern like:

```js
var result = count(count(count(count, 0), event1), event2), event3)
```

This operation is known in the functional world as a higher order function, left-fold. It is a very powerful construct that is useful in solving many problems. When we talk about Event Sourcing, current state is said to be a left-fold of previous facts (events represent the facts).

Projections at their heart allow for the specializing of a generalized function. Their underlying model is that of a left-fold. Looking at the above left fold there are a couple of pieces that we could possibly change. The generic version of this function would look something like:

```js
var result = transform(f(f(f(initial()), e), e), e)
```

Let’s discuss briefly what the three main parts of this function are.

f(state, event) => state – is the function that is run over the series of events.

transform(state) => result – is a function that can transform the state to the form of result you want to receive. This function can also be used to filter results. As an example I could say

```js
function(s) {
   if(s.Foo < 5) return null;
   return s
}
```


initial() => state – returns the initial state you want passed into your left-fold.

Taking one example: f(state, event) => state – gets specialized through a pattern match:

```js
var f1 = function(state,event) {}

when({
   $any : f //runs for all
})

```

or

```js
var f1 = function(state,event) {}
var f2 = function(state,event) {}

when({
Something : f1, //match all Something
SomethingElse f2: //match all SomethingElse
})
```

To see the differences between the two, let’s imagine that we had a stream of events.

Something
SomethingElse
Something

The first would call as:

```js
f1(f1(f1(nil, Something), SomethingElse),Something)
```

The second would call as

```js
f1(f2(f1(nil, Something), SomethingElse),Something)
```

If we were to change the stream to:

Something
SomethingElse
SomethingElse

The second would end up as

```js
f2(f2(f1(nil, Something), SomethingElse),SomethingElse)
```

This shows how the pattern matching can be specialized. If you want to find out more about usage of this, check out the [when](Projections-When) documentation.

###Event Selection###

The second part of how projections work theoretically is the controlling of which events get passed to which definition. In our first example we passed all events in the system through a single left-fold. While many projections due in fact work exactly this way many are only interested in certain events not all events in the entire event store.

fromAll() would read all of the events in the entire event store. fromStream(‘stream’) tells projections to take whatever definition you have and run it against only the events within the stream ‘stream’. Where as fromStreams(['s1', 's2', 's3']) joins the events from three streams and then runs the left-fold of the resulting stream.

Don’t worry if you don’t completely “get” projections after this post, there is a lot to them and we will be delving into a lot more detail and use cases of them. Overall however projections have a relatively simple underlying theory associated with them. Hopefully by understanding the underlying theory it will make the rest of the posts in the series easier to understand.

![Google analytics pixel](https://gaproxy-1.apphb.com/UA-40176181-1/Wiki/Projections-Theory)