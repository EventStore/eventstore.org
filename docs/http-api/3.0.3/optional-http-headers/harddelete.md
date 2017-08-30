---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Optional HTTP Headers: HardDelete"
section: "HTTP API"
version: 3.0.3
exclude_from_sidebar: true
---

The `ES-HardDelete` header controls the way to delete a stream. By default the Event Store will soft delete a stream allowing that stream to later be reused. If you set the `ES-HardDelete` header the stream will be permanently deleted.

```
ouro@ouroboros$ curl -v -X DELETE http://127.0.0.1:2113/streams/foo2 -H "ES-HardDelete:true"
```
```http
HTTP/1.1 204 Stream deleted
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:56:55 GMT
```

This changes the general behaviour from returning a 404 and being recreatable to having the stream now return 410 GONE forever.

```
ouro@ouroboros$ curl -i http://127.0.0.1:2113/streams/foo2
```
```http
HTTP/1.1 410 Deleted
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Autho
rization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:57:01 GMT
```