---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Deleting a Stream"
section: "HTTP API"
version: "3.4.0"
---

To delete a stream over the Atom interface is quite simple. Simply DELETE the resource. This process can be seen in the following cURL commands and should be available from any environment.

<span class="note">
The documentation here applies to versions after 2.0.1. Prior to 2.0.1 only hard deletes were available and the system uses that behaviour.
</span>

## Example

We can create a stream.

```
ouro@ouroboros:~$ curl -i -d @chatmsg.txt http://127.0.0.1:2113/streams/foo -H "Content-Type: application/json"
```

```http
HTTP/1.1 201 Created
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Location: http://127.0.0.1:2113/streams/foo/0
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:39:12 GMT
```

Then delete the stream with a `HTTP DELETE` to the stream resource.

```
ouro@ouroboros$ curl -v -X DELETE http://127.0.0.1:2113/streams/foo
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
Date: Thu, 13 Mar 2014 20:40:05 GMT

```

By default when you delete a stream it will be soft deleted. This means that you can recreate it later if you want to. This is done by setting the `$tb` metadata section as the client API does. If you try to GET a soft deleted stream you will receive a 404.

```
ouro@ouroboros$ curl -i http://127.0.0.1:2113/streams/foo
```

```http
HTTP/1.1 404 Not Found
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:47:18 GMT
```

If desired, recreate the stream by appending new events to it (just like creating a new stream).

```
ouro@ouroboroscurl -i -d @chatmsg.txt http://127.0.0.1:2113/streams/foo -H "Conte
nt-Type:application/json"
```

```http
HTTP/1.1 201 Created
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Location: http://127.0.0.1:2113/streams/foo/1
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:49:30 GMT
```

Now if you get a from a stream that has been soft deleted then recreated you will notice that the version numbers do not start at zero but at where you previously soft deleted the stream from

```
ouro@bouroboros$ curl -i http://127.0.0.1:2113/streams/foo
```

```http
HTTP/1.1 200 OK
Cache-Control: max-age=0, no-cache, must-revalidate
Content-Length: 1215
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
ETag: "1;-2060438500"
Vary: Accept
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:49:34 GMT
```

```javascript
{
  "title": "Event stream 'foo'",
  "id": "http://127.0.0.1:2113/streams/foo",
  "updated": "2014-03-13T20:49:30.3821623Z",
  "streamId": "foo",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": true,
  "selfUrl": "http://127.0.0.1:2113/streams/foo",
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/foo",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/foo/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/foo/2/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/foo/metadata",
      "relation": "metadata"
    }
  ],
  "entries": [
    {
      "title": "1@foo",
      "id": "http://127.0.0.1:2113/streams/foo/1",
      "updated": "2014-03-13T20:49:30.3821623Z",
      "author": {
        "name": "EventStore"
      },
      "summary": "chatMessage",
      "links": [
        {
          "uri": "http://127.0.0.1:2113/streams/foo/1",
          "relation": "edit"
        },
        {
          "uri": "http://127.0.0.1:2113/streams/foo/1",
          "relation": "alternate"
        }
      ]
    }
  ]
}
```

So far we have been looking at soft deletes. You can also execute hard deletes of a stream. These deletes are permanent and the stream can never be recreated. To issue a permanent delete of a stream the `ES-HardDelete` header is used.

```
ouro@ouroboros$ curl -i -d @chatmsg.txt http://127.0.0.1:2113/streams/foo2 -H "Content-Type:application/json"
```

```http
HTTP/1.1 201 Created
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Location: http://127.0.0.1:2113/streams/foo2/1
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:54:24 GMT
```

Then the delete as before but with the permanent delete header

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

This stream is now permanently deleted unlike before where you received a 404 the response will now be a 410 GONE.

```
ouro@ouroboros$ curl -i http://127.0.0.1:2113/streams/foo2
```

```http
HTTP/1.1 410 Deleted
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 20:57:01 GMT
```

If you try to recreate the stream as in the above example you will also receive a 410 GONE.

```
ouro@ouroboros$ curl -i -d @chatmsg.txt http://127.0.0.1:2113/streams/foo2 -H "Content-Type:application/json"
```

```http
HTTP/1.1 410 Stream deleted
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 21:00:00 GMT
```

The same applies if you try to delete an already deleted stream. You will receive a 410 GONE.

```
ouro@ouroboros$ curl -i -X DELETE http://127.0.0.1:2113/streams/foo2 -H "ES-HardDelete: true"
```

```http
HTTP/1.1 410 Stream deleted
Content-Length: 0
Content-Type: text/plain; charset=utf-8
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Date: Thu, 13 Mar 2014 21:19:33 GMT
```