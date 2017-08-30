---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Optional HTTP Headers: Resolve LinkTo"
section: "HTTP API"
version: "3.2.0"
exclude_from_sidebar: true
---

When using projections you can have links placed into another stream. By default the Event Store will always resolve linkTos for you returning the event that the link points to. You can use the ES-ResolveLinkTos: false HTTP header to tell the Event Store to return you the actual link and to not resolve it.

The differences in behaviour can be seen in the following cURL commands.

```http
ouro@ouroboros:~/src/EventStore.wiki$ curl -i -u admin:changeit http://127.0.0.:2113/streams/testing2/7 -H "ES-ResolveLinkTos: true"
HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Cache-Control: max-age=31536000, public
Vary: Accept
Content-Type: application/vnd.eventstore.atom+json; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Thu, 27 Jun 2013 14:17:42 GMT
Content-Length: 462
Keep-Alive: timeout=15,max=100

{
  "title": "4@$projections-$all",
  "id": "http://127.0.0.1:2113/streams/%24projections-%24all/4",
  "updated": "2013-06-27T10:55:32.408301Z",
  "author": {
    "name": "EventStore"
  },
  "summary": "$ProjectionCreated",
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/%24projections-%24all/4",
      "relation": "edit"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/%24projections-%24all/4",
      "relation": "alternate"
    }
  ]
}
```

<span class="note">
The content links are pointing back to the original `$projections-$all` stream (the linked events are being resolved back to where they point). With the header set the links (or embedded content) will instead point back to the actual linkTo events.
</span>

```http
ouro@ouroboros:~/src/EventStore.wiki$ curl -i -u admin:changeit http://127.0.0.:2113/streams/testing2/7 -H "ES-ResolveLinkTos: false"
HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Cache-Control: max-age=31536000, public
Vary: Accept
Content-Type: application/vnd.eventstore.atom+json; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Thu, 27 Jun 2013 14:16:37 GMT
Content-Length: 673
Keep-Alive: timeout=15,max=100

{
  "title": "7@testing2",
  "id": "http://127.0.0.1:2113/streams/testing2/7",
  "updated": "2013-06-27T11:16:04.171969Z",
  "author": {
    "name": "EventStore"
  },
  "summary": "$>",
  "content": {
    "eventStreamId": "testing2",
    "eventNumber": 7,
    "eventType": "$>",
    "data": "4@$projections-$all",
    "metadata": {
      "$v": "7:-1:0:2",
      "$c": 2046,
      "$p": 1538,
      "$causedBy": "8ac4f769-7bfb-49aa-bd87-c591cc116697"
    }
  },
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/testing2/7",
      "relation": "edit"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/testing2/7",
      "relation": "alternate"
    }
  ]
}
```