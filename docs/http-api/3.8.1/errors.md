---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Errors"
section: "HTTP API"
version: "3.8.1"
---

There are many error conditions that can be returned from the writing or reading of a stream. All of these can be identified by their status codes and should be relatively easy to diagnose.

## Stream Never Created Get

```http
ouro@ouroboros:~/src/EventStore.wiki$  curl -i -H "Accept:application/json" "http://127.0.0.1:2113/streams/anewstream"
HTTP/1.1 404 Not Found
Access-Control-Allow-Methods: DELETE, GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Content-Type: ; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Tue, 02 Apr 2013 14:41:29 GMT
Content-Length: 0
Keep-Alive: timeout=15,max=100

```

## Write to Stream with Invalid Content for Content Type

```http
oruo@ouroboros:~/src/EventStore.wiki$ cat ~/simpleevent.txt
[
  {
    "eventId": "fbf4b1a1-b4a3-4dfe-a01f-ec52c34e16e4",
    "eventType": "event-type",
    "data": {

      "a": "1"
    }
  },
  {
    "eventId": "0f9fad5b-d9cb-469f-a165-70867728951e",
    "eventType": "event-type",
    "data": {

      "a": "1"
    }
  }
]

ouro@ouroboros:~$  curl -i -d @/home/ouro/simpleevent.txt "http://127.0.0.1:2113/streams/newstream" -H "Content-Type:text/xml"
HTTP/1.1 400 Write request body invalid
Access-Control-Allow-Methods: DELETE, GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Content-Type: 
Server: Mono-HTTPAPI/1.0
Date: Tue, 02 Apr 2013 14:48:27 GMT
Content-Length: 0
Connection: close
```

## Security Denied

```http
ouro@ouroboros:~/src/EventStore.wiki$ curl -i "http://127.0.0.1:2113/streams/newstream" -H "Content-Type:application/json" -u admin:foo
HTTP/1.1 401 Unauthorized
Access-Control-Allow-Methods: 
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
WWW-Authenticate: Basic realm="ES"
Content-Type: 
Server: Mono-HTTPAPI/1.0
Date: Fri, 28 Jun 2013 12:45:30 GMT
Content-Length: 0
Keep-Alive: timeout=15,max=100
```