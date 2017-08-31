---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Description Document"
section: "HTTP API"
version: "3.8.1"
---

## What is it?

With the addition of [Competing Consumers](/docs/introduction/latest/competing-consumers) which is essentially another way of reading streams, the need arose to expose these different methods to consumers.

The introduction of the description document has some benefits

- Clients can rely on the keys (streams, streamSubscription) in the description document to remain unchanged across versions of Event Store and can be relied on as a lookup for the particular method of reading a stream.
- Allows the restructuring of URIs underneath without breaking clients. e.g. `/streams/newstream` -> `/streams/newstream/atom`

## How do I get the description document?

There are 3 ways in which the description document will be returned.

- Attempting to read a stream with an unsupported media type. 
- Attempting to read a stream with no accept header.
- Requesting the description document explicitly.

The client is able to request the description document by passing `application/vnd.eventstore.streamdesc+json` in the `accept` header
e.g.

```
curl -i http://localhost:2113/streams/newstream -H "accept:application/vnd.eventstore.streamdesc+json"
```

```
HTTP/1.1 200 Description Document
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-Forwarded-Host, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Content-Type: application/vnd.eventstore.streamdesc+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Wed, 02 Dec 2015 07:05:37 GMT
Content-Length: 590
Keep-Alive: timeout=15,max=100

{
  "title": "description document for newstream",
  "description": "The description document will be presented when the following is true for the Accept Header. (No Accept Header, Unsupported Response Type, Description Document Requested)",
  "_links": {
    "self": {
      "href": "/streams/newstream",
      "supportedContentTypes": [
        "application/vnd.eventstore.streamdesc+json"
      ]
    },
    "stream": {
      "href": "/streams/newstream",
      "supportedContentTypes": [
        "application/atom+xml",
        "application/vnd.eventstore.atom+json"
      ]
    },
    "streamSubscription": [
      {
        "href": "/subscriptions/newstream/competing_consumers_group1",
        "supportedContentTypes": [
          "application/vnd.eventstore.competingatom+xml",
          "application/vnd.eventstore.competingatom+json"
        ]
      },
      {
        "href": "/subscriptions/newstream/competing_consumers_group2",
        "supportedContentTypes": [
          "application/vnd.eventstore.competingatom+xml",
          "application/vnd.eventstore.competingatom+json"
        ]
      }
    ]
  }
}%
```

In the example above, the client has requested the description document for the stream called `newstream` which has a set of links which describes the supported methods and content types for reading.

The document also includes additional methods if they are available such as the `streamSubscription` (Which is HTTP Competing Consumers). What is displayed in the example above is that there are 2 subscriptions for the `newstream`, namely `competing_consumers_group1` and `competing_consumers_group2`. If there are no subscriptions to the `newstream`, the `streamSubscription` key will be absent.