---
title: "Projections 5: Indexing"
date: 2013-02-18T10:02Z
author: "Greg Young"
layout: blog-post
category: "Tutorials"
tags: ["Event Store","Projections","Event sourcing"]
---

Now we can start getting to some of the interesting things in Projections. It was quite odd, as I was leading up to this post last night we got into a **very long** discussion about indexing inside the Event Store on twitter. Mike Brown noted that it would be really useful if we built lucene like indexing into the system so he could use the Event Store as an Audit Log that was easily searchable by things like correlationId and username. While the indexing is very different than something like lucene it is still quite possible.

In order to get into indexing we will need to introduce a new basic operation linkTo. linkTo works very similarly to emit except when you linkTo("stream", event) it does not actually write the event to the stream. It instead emits a pointer to the event to the stream. When you resolve "stream" you will see the event as if it was part of that stream but that is due to the resolution of the pointer (with the TCP API you can say whether or not you want to resolve links). Let's try an example.

```javascript
fromAll().when({$any : function(s,e) { linkTo(e.metadata.username, e); });
```

What this code does is it listens to All events in the system. As they happen it will produce links into streams based upon the user (providing username is in metadata). If we were to have:

```
Chat1 -> Greg Says hi
Chat2 -> John Says yo
Chat1 -> John Says Hey Greg
Chat2 -> Jill Says donuts!
Chat3 -> Jill Says anyone there?
Chat3 -> Greg Says sure
```

With this projection running we would be creating indexes. To start with there are three streams here (Chat1,Chat2, and Chat3) They look like: 

```
Stream Chat1
---------
Chat1 -> Greg Says hi
Chat1 -> John Says Hey Greg

Stream Chat2
---------
Chat2 -> John Says yo
Chat2 -> Jill Says donuts!

Stream Chat3
---------
Chat3 -> Jill Says anyone there?
Chat3 -> Greg Says sure
```


After our index is built we will have six streams (you can build an index at anytime). It will create three additional streams Greg, John, and Jill. They would look at follows.

```
Stream Greg
---------
Chat1 -> Greg Says hi
Chat3 -> Greg Says sure

Stream John
---------
Chat1 -> John Says Hey Greg
Chat2 -> John Says yo

Stream Jill
---------
Chat2 -> Jill Says donuts!
Chat3 -> Jill Says anyone there?
```

If I were to point my browser at mydomain.com/streams/jill I would see all of Jill's chat messages. This is generally how indexes get built up using the Event Store. One nice thing about this methodology is that as the result is a stream, you can listen to that stream like any other stream in the system to get updates for when new things are happening.

You will also notice if you look at an ATOMfeed that the URI to the original event does not change. As such if you are working over ATOM you likely will not pull the event down twice (it will be in cache). In our next post we will look at a quick use case for applying linkTo.