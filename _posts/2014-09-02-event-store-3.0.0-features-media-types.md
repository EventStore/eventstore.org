---
title: "Event Store 3.0.0 - New Media Types"
date: 2014-09-02T13:00Z
author: "James Nugent"
layout: blog-post
category: "News"
tags: ["Event Store","Version 3.0"]
---

*As we gear up to launch version 3.0.0 of Event Store, we decided it would be a good idea to run a short series of articles describing some of the new features and changes for those who haven’t seen them. If there are things you want to know about in particular, please get in touch on Twitter, [@eventstore](https://twitter.com/eventstore)!*

##New Media Types and Headers

HTTP is one of our two primary protocols - in fact it's expected that most
systems will be using the Event Store over HTTP. In version 3.0.0 we made some
breaking changes to how events can be posted in order to try to make things
more convenient for HTTP-based clients.

###New Media Types For Posting Multiple Events

Since version 1, you could append events to a stream by posting to the stream
resource with the request body in a format which looks like this:

```json
[
    {
        "eventId": "fbf4a1a1-b4a3-4dfe-a01f-ec52c34e16e4",
        "eventType": "myEventType",
        "data": {
            "myField": "aValue"
        }
    },
    {
        "eventId": "1bcc327b-d561-42c0-a3f1-43a4a9d47b7a",
        "eventType": "myOtherEventType",
        "data": {
            "myField2": "anotherValue"
        }
    },
]
```

As of version 3.0.0, you can still use this exact same format, but this is now
of content type `application/vnd.eventstore.events+json`, rather than
`application/json` as was previously the case. There is an XML counterpart
named `application/vnd.eventstore.events+xml`, which has the same structure
formatted as XML instead of JSON (which was previously posted as either
`text/xml` or `application/xml`.

###Posting Single Events

As of version 3.0.0, single events can be appended to a stream by posting the
data which makes up the event as the body of the post, and setting the event ID
(and optionally the expected version) via HTTP headers. The content type should
match the request body.

For example, the following request would post a JSON formatted event into the
stream `myStream`:

```http
POST http://localhost:2113/streams/myStream HTTP/1.1
Content-Type: application/json
ES-EventType: SomeEvent
ES-EventId: c322e299-cb73-4b47-97c5-5054f920746e
Host: localhost:2113
Content-Length: 30

{
    "myField": "myValue"
}
```

###Posting Without An Event ID

Some clients have issues creating UUIDs client side. This causes issues when
trying to make use of the idempotent writing features of the Event Store, since
there can’t be a unique ID on the events if there's no method of generating
UUIDs. To make this easier, we've implemented a redirect-to-idempotent-URI
pattern.

Posting to a stream resource with a content type of `application/json`, but without an event ID will redirect you to a URI including a server-generated Event ID, to which you can retry indefinitely:

*Request*

```http
POST http://localhost:2113/streams/myStream HTTP/1.1
Content-Type: application/json
ES-EventType: SomeEvent
Host: localhost:2113
Content-Length: 30

{
    "myField": "myValue"
}
```

*Response*

```http
HTTP/1.1 307 Temporary Redirect
Content-Length: 28
Content-Type: text/plain; charset=utf-8
Location: http://localhost:2113/streams/myStream/incoming/6f7902ca-5a43-4518-9f17-aaab80f2acdf
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Date: Tue, 02 Sep 2014 14:23:36 GMT

Forwarding to idempotent URI
```

Following the redirect to the URI to which you are redirected will then write the event:

*Request*

```http
POST http://localhost:2113/streams/myStream/incoming/6f7902ca-5a43-4518-9f17-aaab80f2acdf HTTP/1.1
Host: localhost:2113
Content-Type: application/json
Content-Length: 30
ES-EventType: SomeEvent

{
    "myField": "myValue"
}
```

*Response*

```http
HTTP/1.1 201 Created
Transfer-Encoding: chunked
Content-Type: text/plain; charset=utf-8
Location: http://localhost:2113/streams/myStream/0
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Date: Tue, 02 Sep 2014 14:23:36 GMT
```

###Summary

These changes bring the HTTP interface more in line with best practices.
However, as reflected in the major version number increase they are likely
breaking for clients writing using the `application/json` type from version 2,
which will need updating to `application/vnd.eventstore.events+json` or the XML
counterpart.
