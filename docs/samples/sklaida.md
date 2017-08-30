---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Sklaida"
section: "samples"
version: 0.0.0
---

## Sklaida

The sklaida sample is a full end to end application including a UI. It is an example of using the Event Store for a common system design known as a scatter/gather. Scatter/gather is a common system design especially for web applications. The source can be downloaded [here](http://github.com/eventstore/sklaida)

The general idea of a scatter/gather can be seen in a price comparison application. A user will specify something that they want to compare prices on. The application has N adapters to endpoints that can each return a price. When a request is received that request is sent to all of the adapters and then the results are sent to the client as the results are received.

The example is made up for the pricing of ouros (that cute little green dragon). The user can select varying options about the ouro they want to price and the request will then be routed to N pricing engines. The pricing engines take varying amounts of time to price a request, when they complete they write the result back to a stream.

Included is a backend that offers a RESTful interface, the client (in javascript), and a backend adapter host that runs the endpoint adapters. When the UI does a search, the client will do a POST to the RESTful service. The backend will write the event to a given event stream (based on a guid) and return a location header (202 accepted) to the client. This location header points to an atom feed in the event store. The client will then poll this atom feed.

The backend adapters will receive the request based on the subscription they hold with the event store (volatile subscription). The adapters will then each process the message possibly returning a result. If a result is returned it is written back into the stream for this request (the client will then receive it based on polling the atom feed).

Streams are also given a time to live when they are being created. In a production system you may also wish to apply some level of permissions to the reading of the stream.

A related architecture to this example would be to use a competing consumer subscription between n instances of the same adapter with the messaging patterns staying roughly equivalent. One could see this being used for a service such as charging credit cards.