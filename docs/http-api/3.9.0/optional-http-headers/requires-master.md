---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Optional HTTP Headers: Requires Master"
section: "HTTP API"
version: "3.9.0"
exclude_from_sidebar: true
---

When running in a clustered environmenty there are times when you only want an operation to happen on the current leader node. A client could get information in an eventually consistent fashion by gossiping with the servers (the TCP client included with the multi-node version does this).

Over HTTP the RequiresMaster header tells the node that it is not allowed to serve in the case of a read or forward the request in the case of a write. If the node is the master everything will work as normal, if it is not it will respond with a 307 temporary redirect to the master.

Run on the master:

```
ouro@ouroboros:~curl -i "http://127.0.0.1:32004/streams/stream" -H "ES-RequireMaster: True"
```

```http
HTTP/1.1 200 OK
Cache-Control: max-age=0, no-cache, must-revalidate
Content-Length: 1296
Content-Type: application/vnd.eventstore.atom+json; charset: utf-8
ETag: "0;-2060438500"
Vary: Accept
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Date: Thu, 27 Jun 2013 14:48:37 GMT
```

```json
{
  "title": "Event stream 'stream'",
  "id": "http://127.0.0.1:32004/streams/stream",
  "updated": "2013-06-27T14:48:15.2596358Z",
  "streamId": "stream",
  "author": {
    "name": "EventStore"
  },
  "links": [
    {
      "uri": "http://127.0.0.1:32004/streams/stream",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:32004/streams/stream/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:32004/streams/stream/0/forward/20",
      "relation": "last"
    },
    {
      "uri": "http://127.0.0.1:32004/streams/stream/1/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:32004/streams/stream/metadata",
      "relation": "metadata"
    }
  ],
  "entries": [
    {
      "title": "0@stream",
      "id": "http://127.0.0.1:32004/streams/stream/0",
      "updated": "2013-06-27T14:48:15.2596358Z",
      "author": {
        "name": "EventStore"
      },
      "summary": "TakeSomeSpaceEvent",
      "links": [
        {
          "uri": "http://127.0.0.1:32004/streams/stream/0",
          "relation": "edit"
        },
        {
          "uri": "http://127.0.0.1:32004/streams/stream/0",
          "relation": "alternate"
        }
      ]
    }
  ]
}
```

Run on any other node

```
curl -i "http://127.0.0.1:31004/streams/stream" -H "ES-RequireMaster: True"
```

```http
HTTP/1.1 307 Temporary Redirect
Content-Length: 0
Content-Type: text/plain; charset: utf-8
Location: http://127.0.0.1:32004/streams/stream
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Date: Thu, 27 Jun 2013 14:48:28 GMT

```