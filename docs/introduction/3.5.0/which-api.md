---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Which API to Use?"
section: "Introduction"
version: "3.5.0"
---

There are multiple interface over which you can communicate with the Event Store. This document describes them briefly and with the aim of helping you choose which one may be best for your scenario.

## TCP

A low level protocol is offered in the form of an asynchronous TCP protocol that exchanges protobuf objects. At present this protocol only has adapters for .NET and Node.js, though more adapters are being written for other platforms including the JVM.

### Supported Clients

- [.net Client](http://www.nuget.org/packages/EventStore.Client)
- [JVM Client](https://github.com/EventStore/EventStore.JVM)

### Community Developed Clients

- [Node.js](https://www.npmjs.com/package/event-store-client)
- [Node.js](https://www.npmjs.com/package/ges-client)
- [Node.js](https://github.com/nicdex/eventstore-node)
- [Haskell](https://github.com/YoEight/eventstore)
- [Erlang](https://bitbucket.org/anakryiko/erles)
- [F#](https://github.com/haf/EventStore.Client.FSharp)
- [PHP](https://github.com/dbellettini/php-eventstore-client)
- [Elixir](https://github.com/exponentially/extreme)
- [Python](https://github.com/madedotcom/atomicpuppy)
- [Java8](https://github.com/msemys/esjc)

## HTTP

The other interface is HTTP-based. In particular it is based upon the [AtomPub protocol](http://tools.ietf.org/html/rfc5023). As it operates over HTTP this will be seemingly less efficient, but it can be supported in nearly any environment.

### Supported Clients

- [HTTP API](/http-api)

### Community Developed Clients

- [Ruby](https://github.com/arkency/http_eventstore)

<span class="note">
Feel free to add more! Being listed as a community client does not imply official support.
</span>

## Which to use?

There are many factors that go into the choice of which of the protocols (TCP vs HTTP) that you want to use. Both have their strengths and weaknesses.

### TCP will be faster

This especially applies to subscribers as events will be pushed to the subscriber, whereas with Atom the subscribers will poll the head of the atom feed to check if new events are available. The difference here is can be as high as 2–3 orders of magnitude (sub-10ms for TCP vs seconds for Atom).

In addition, the number of writes per second which can be supported is often dramatically higher when using TCP. At the time of writing, standard Event Store applicances can service around 2000 writes/second over HTTP compared to 15,000-20,000/second over TCP! This might be a deciding factor if you are in a high-performance environment.

### AtomPub is more scalable for large numbers of subscribers.

This is due to the ability to use intermediary caching with Atom feeds. Most URIs handed out by the Event Store point to immutable data and are therefore infinitely cachable. Therefore on a replay of a projection much of the data required is likely to be available on a local or intermediary cache. This can also lead to lower network traffic.

Atom will also tend to operate better in a large heterogenous environment where you have callers from many different platforms. This is especially true if you have to integrate with many teams/external vendors. Atom is an industry standard and well documented protocol that you can point them to where as the TCP protocol is a custom protocol they would need to understand.

There is good existing tooling for Atom on most platforms including feed readers (e.g. Fiddler). None of this tooling exists at this point for the analysing of traffic with the TCP protocol.

<span class="note">
In general our recommendation would be to use AtomPub as your primary protocol unless you have low subscriber SLAs or need higher throughput on reads and writes than Atom can offer. This is largely due to the open nature and ease of use of the Atom protocol. Very often in integration scenarios these are more important than raw performance.
</span>
