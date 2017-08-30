---
title: "Event Store 4.0.0 Released"
author: "Event Store Team"
layout: blog-post
---

# Overview

We are extremely excited to announce the next major version of Event Store 4.0.0. Projections are now a supported feature.

# What's changed in the 4.0.0 Server

- Projections are now a supported feature (This means you can scream and shout about any issues you encounter and we will do our best to resolve them in a timely manner)
- Introduced a Windows package installable via chocolatey
- Introduced a Ubuntu 16.04 package installable via package cloud
- Upgraded V8 to [5.2](https://v8project.blogspot.co.uk/2016/06/release-52.html). This means custom javascript projections now support ECMASCRIPT 6 & ECMASCRIPT 7
- A series of projection issues has been fixed, which includes projections that seem to have just gotten stuck and refused to continue processing
- Event Store on Linux has been upgraded to Mono 4.6.2
- Event Store on Windows has been upgraded to .NET 4.6
- Upgrade the stream version from int32 to int64. This ups the limit for events in a stream from int.MaxValue to long.MaxValue
- Direct IO/Unbuffered IO is now supported in the transaction engine

# What's changed in the .NET Client 4.0.0

- Option to prefer a randomly selected node. This helps with distributing load from multiple clients across the nodes in a cluster
- Client connection names are now propogated through to the server

# What's changed in the Event Store 4.0.0 UI

- Competing Consumers label has been changed to Persitent Subscriptions
- Client's connection names are shown in the UI

# Should I upgrade from Event Store Version 3.x

There are risks associated with upgrading and that is covered in the section titled "I have run into problems, how do I roll back?". However if you answer yes to any of the following, it is worth upgrading.

- I want to upgrade to a newer kernel but have run into a kernel regression and you have told me it's because of Mono 3.12.1. Upgrading to Mono 4.6.2 has reduced to probability of running into the known kernel regression issue which is documented [here](https://github.com/EventStore/EventStore#regressions-with-mono-3121-and-some-versions-of-the-linux-kernel).
- My projections become unresponsive and I have read that it's due to reads expiring and projections not being tolerable of this scenario. (See `Known issues`)
- The number of events in some of my streams is reaching the limit of int.MaxValue.

# Is there an upgrade or migration process associated with upgrading to Event Store 4.0.0?

There is no migration process required.

# How do I upgrade my cluster?

Event Store 4.0.0 and < Event Store 3.9.4 nodes cannot live alongside each other in the same cluster.

You would need to take down all the nodes in a cluster and upgrade them to Event Store 4.0.0 before bringing the nodes back up. The reason for this is highlighted in the section titled "I have run into problems, how do I roll back?". 
If you cannot tolerate any downtime, we have you covered.

In the next coming days, we will be releasing an Event Store version 3.9.4 which will be able to understand the changes from Event Store 4.0.0. It will allow for a rolling upgrade in a cluster with minimal downtime. This means you would be able to take down a node in a cluster and upgrade the node to 3.9.4. This will be the process for each of the nodes in the cluster until the entire cluster are running nodes of 3.9.4. You would then be able to repeat the process for 4.0.0.

# I have run into problems, how do I roll back?

With the upgrade of the limitation of the number of events in a stream from int.MaxValue to long.MaxValue, new data structures are written down to disk that older versions of Event Store does not understand and therefor would identify the database as being corrupt. This means once you have upgraded to Event Store 4.0.0, you cannot rollback to < 3.9.4.

There are ways to roll back which we are happy to discuss if you have run into an unrecoverable error. If this is the case, please reach out to us.

# Will I have to upgrade my clients?

The existing client libraries are still compatible with Event Store 4.0.0 with some caveats. Even though the existing client libraries will still work, they will not return the correct Event Numbers if the number is greater than int.MaxValue. This means that the libraries will have an integer overflow.

The TCP protocol which uses google protocol buffers have had it's event_number types changed from int32 to int64. This means that given that you don't have event numbers larger than int.MaxValue the event numbers that are sent across the wire to your older client should work just fine.

There are some behaviour to take into consideration which we will address next

## Deletes

Hard deletes will be converted by the server from long.MaxValue to int.MaxValue before being sent to the client. $tb on soft delete metadata will be converted by the server to long.MaxValue. This can cause errors if you try to read stream metadata of a deleted stream.

## Writing to a stream with more than int.MaxValue events

The write will succeed, provided you use ExpectedVersion.Any. NextExpectedVersion will overflow.

## Reading from a stream with more than int.MaxValue events

The read will succeed. You will be limited by how far you can read, though, as there is no way for you to read from past int.MaxValue events. Last and Next event numbers will overflow. Any event that you read with an event number greater than int.MaxValue will overflow.

## Reading from all when there are streams with more than int.MaxValue events

The read will succeed, but events with an event number greater than int.MaxValue will overflow.

## Subscribing to a stream with more than int.MaxValue events

Volatile subscriptions and persistent subscriptions will be able to subscribe and connect successfully. A catchup subscription may fail while catching up if it tries to read from an overflowed next position. Event numbers will overflow.

## Subscribing to all when there are streams with more than int.MaxValue events

Subscriptions on all will subscribe successfully, event numbers will overflow.

# I am a third party tcp client library developer, what changes do I need to make?

- A client will have to identify itself as a client version 1 by sending an IdentifyClient (0xF5) [message](https://github.com/EventStore/EventStore/blob/release-v4.0.0/src/Protos/ClientAPI/ClientMessageDtos.proto#L380).
- Client will have to wait for the confirmation [message](https://github.com/EventStore/EventStore/blob/release-v4.0.0/src/Protos/ClientAPI/ClientMessageDtos.proto#L385) ClientIdentified (0xF6) to be returned from the server
- Client will have to make the necessary protobuf changes. You can use the proto file [here](https://github.com/EventStore/EventStore/blob/release-v4.0.0/src/Protos/ClientAPI/ClientMessageDtos.proto) as reference

# Known issues

## Projections

There are still known issues with projections which has been marked in [our github repository](https://github.com/EventStore/EventStore/issues?q=is%3Aissue+is%3Aopen+label%3Aprojections). They are being looked at and you can expect active development on these issues.

# Breaking changes

## Projections

The `whenyAny` function has been removed in favour of `$any`.

## Event Store .NET 4.0.0 Client

The .NET 4.0.0 client is not compatible with Event Store Nodes Pre 3.9.4.

## Handling of special characters in HTTP Listener between Mono 3.12.1 and Mono 4.6.2

In Mono 3.12.1 the behaviour of HttpListener and how it handled special encoded characters in stream names such as slashes, hashes and questions, etc etc worked differently than how they did on Windows. With Event Store 4.0.0 which uses Mono 4.6.2 the behaviour of HttpListener is the same as it is on Windows.

For example.
stream id: foo/bar
Previously, you would have been able to query the above mentioned stream in the following manner

```
curl http://localhost:2113/streams/foo%2Fbar -H "accept:application/vnd.eventstore.atom+json
```

Which would have returned

```
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
```

Querying the stream in the same way with Event Store 4.0.0 on Mono 4.6.2 would return the following

```
HTTP/1.1 400 'bar' is not valid event number
Access-Control-Allow-Methods: GET, OPTIONS
```

A workaround to this particular issue would be to escape the slash

```
curl http://localhost:2113/streams/foo%252Fbar -H "accept:application/vnd.eventstore.atom+json
```

# I have run into an issue, please help?

You can reach out to us over at our [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store). If you have a support contract, please contact us via the official support channel.

