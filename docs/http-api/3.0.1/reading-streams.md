---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Reading Streams and Events"
section: "HTTP API"
version: 3.0.1
---

Reading from streams with AtomPub can be a bit confusing if you have not done it before but we will go through in this document how reading works. Luckily for many environments the AtomPub protocol has already been implemented!

The Event Store is compliant with the [Atom 1.0 Specification](http://tools.ietf.org/html/rfc4287) as such many other systems have built in support for the Event Store.

## Existing Implementations

| Library     | Description                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| NET (BCL)   | `System.ServiceModel.SyndicationServices`                                                            |
| JVM         | [http://java-source.net/open-source/rss-rdf-tools](http://java-source.net/open-source/rss-rdf-tools) |
| PHP         | [http://simplepie.org/](http://simplepie.org/)                                                       |
| Ruby        | [http://simple-rss.rubyforge.org](http://simple-rss.rubyforge.org)                                   |
| Clojure     | [https://github.com/scsibug/feedparser-clj](https://github.com/scsibug/feedparser-clj)               |
| Go          | [https://github.com/jteeuwen/go-pkg-rss](https://github.com/jteeuwen/go-pkg-rss)                     |
| Python      | [http://code.google.com/p/feedparser/](http://code.google.com/p/feedparser/)                         |
| node.js     | [https://github.com/danmactough/node-feedparser](https://github.com/danmactough/node-feedparser)     |
| Objective C | [https://geekli.st/darvin/repos/MWFeedParser](https://geekli.st/darvin/repos/MWFeedParser)           |

<span class="note--warning">
The above list of implementations are not officially supported by Event Store, if you know of any others then please let us know.
</span>

## Reading a Stream

Streams are exposed as a resource located at http(s)://yourdomain.com:port/streams/{stream}. If you do a simple GET to this resource you will get a standard AtomFeed document.

```
curl -i -H "Accept:application/vnd.eventstore.atom+json" "http://127.0.0.1:2113/streams/newstream2"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "0;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 12:15:08 GMT
Content-Length: 1272
Keep-Alive: timeout=15,max=100

{
  "title": "Event stream 'newstream2'",
  "id": "http://127.0.0.1:2113/streams/newstream2",
  "updated": "2015-03-13T12:13:42.492473Z",
  "streamId": "newstream2",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": true,
  "selfUrl": "http://127.0.0.1:2113/streams/newstream2",
  "eTag": "0;248368668",
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/1/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/metadata",
      "relation": "metadata"
    }
  ],
  "entries": [
    {
      "title": "0@newstream2",
      "id": "http://127.0.0.1:2113/streams/newstream2/0",
      "updated": "2015-03-13T12:13:42.492473Z",
      "author": {
        "name": "EventStore"
      },
      "summary": "event-type",
      "links": [
        {
          "uri": "http://127.0.0.1:2113/streams/newstream2/0",
          "relation": "edit"
        },
        {
          "uri": "http://127.0.0.1:2113/streams/newstream2/0",
          "relation": "alternate"
        }
      ]
    }
  ]
}
```

There some important bits to notice here. The Feed here has one item in it. The newest items are always first going to the oldest items. For each entry there are a series of links. These links are links to the events themselves though the events can also be embedded using the `?embed` parameter provided you are requesting JSON. To get an event follow the alternate link and set your Accept headers to the mime type you would like to get the event in.

<span class="note">
The accepted content types for GET requests are currently:
</span>

- `application/xml`
- `application/atom+xml`
- `application/json`
- `application/vnd.eventstore.atom+json` 
- `text/xml`
- `text/html`

```
curl -i http://127.0.0.1:2113/streams/newstream2/0 -H "Accept: application/json"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=31536000, public
Vary: Accept
Content-Type: application/json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 12:17:48 GMT
Content-Length: 14
Keep-Alive: timeout=15,max=100

{
  "a": "1"
}
```

Alternatively, the atom version of the event will contain additional details about the event.

```
curl -i http://127.0.0.1:2113/streams/newstream2/0 -H "Accept: application/vnd.eventstore.atom+json"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=31536000, public
Vary: Accept
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 13:54:43 GMT
Content-Length: 577
Keep-Alive: timeout=15,max=100

{
  "title": "0@newstream2",
  "id": "http://127.0.0.1:2113/streams/newstream2/0",
  "updated": "2015-03-13T12:13:42.492473Z",
  "author": {
    "name": "EventStore"
  },
  "summary": "event-type",
  "content": {
    "eventStreamId": "newstream2",
    "eventNumber": 0,
    "eventType": "event-type",
    "data": {
      "a": "1"
    },
    "metadata": ""
  },
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/0",
      "relation": "edit"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/0",
      "relation": "alternate"
    }
  ]
}
```

## Feed Paging

The next thing towards understanding how to read a stream is understanding the first/last/previous/next links that are given within a stream. The basic idea is that the server will give you links so that you can walk through a stream.

To read through the stream we will follow the pattern defined in <a href="http://tools.ietf.org/html/rfc5005">RFC 5005</a>.

In the example above the server had returned as part of its result:

```json
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/1/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/metadata",
      "relation": "metadata"
    }
  ]
```

This is saying that there is not a next URL (this means all the information is in this request). It is also saying that this URL is the first link. When dealing with these urls there are two ways of reading the data in the stream. You can either go to the last link and then move forward following previous or you can go to the first link and follow the next links, the final item will not have a next link.

If you want to follow a live stream then you would keep following the previous links. When you reach the end (current portion) of a stream you will receive an empty document that does not have entries (or a previous link). You should then continue polling this URI (in the future a document will appear here). This can be seen by trying the previous link from the above feed.

```
curl -i http://127.0.0.1:2113/streams/newstream2/1/forward/20 -H "Accept:application/vnd.eventstore.atom+json"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "0;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 14:04:47 GMT
Content-Length: 795
Keep-Alive: timeout=15,max=100

{
  "title": "Event stream 'newstream2'",
  "id": "http://127.0.0.1:2113/streams/newstream2",
  "updated": "0001-01-01T00:00:00Z",
  "streamId": "newstream2",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": false,
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/0/forward/20",
      "relation": "last"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/0/backward/20",
      "relation": "next"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/metadata",
      "relation": "metadata"
    }
  ],
  "entries": []
}
```

When parsing an atom subscription the IDs of events will always stay the same. This is important for figuring out when things are pointing to the same event.

While the simple example above is easy to look at, let’s try an example with more than a single page in it. If you want to do this yourself you can use the testclient that comes with event store and use the `VERIFY` command that will make some fake banking data. After running this command you should find many streams such as `http://127.0.0.1:2113/streams/account-28` in the system.

Going to the link `http://127.0.0.1:2113/streams/account-28` will return us:

```
curl -i http://127.0.0.1:2113/streams/account-28 -H "Accept:application/vnd.eventstore.atom+json"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "180;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:08:06 GMT
Content-Length: 11095
Keep-Alive: timeout=15,max=100

{
  "title": "Event stream 'account-28'",
  "id": "http://127.0.0.1:2113/streams/account-28",
  "updated": "2015-03-13T16:06:18.47214Z",
  "streamId": "account-28",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": true,
  "selfUrl": "http://127.0.0.1:2113/streams/account-28",
  "eTag": "180;248368668",
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/account-28",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/0/forward/20",
      "relation": "last"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/160/backward/20",
      "relation": "next"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/181/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/metadata",
      "relation": "metadata"
    }
  ],
  "entries": <SNIP>
```

Using the links in this response it is possible to walk through all of the events in the stream either by going to the “last” URL and walking "previous" or by walking "next" from the “first” link.

If you go to the “last” link you will receive:

```
curl -i http://127.0.0.1:2113/streams/account-28/0/forward/20 -H "Accept:application/vnd.eventstore.atom+json"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=31536000, public
Vary: Accept
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:16:05 GMT
Content-Length: 10673
Keep-Alive: timeout=15,max=100

{
  "title": "Event stream 'account-28'",
  "id": "http://127.0.0.1:2113/streams/account-28",
  "updated": "2015-03-13T16:05:24.262029Z",
  "streamId": "account-28",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": false,
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/account-28",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/20/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/account-28/metadata",
      "relation": "metadata"
    }
  ],
  "entries": <SNIP>
```

You would then follow its “previous” link until you got back to the head of the document. This is the general way of reading back a stream. Once at the end you can continue reading events as they happen by polling the previous link and you will get events in near real time as they happen.

It is also important to note that all links with the exception of the head link are fully cachable as seen in the HTTP header `Cache-Control: max-age=31536000, public`. This is very important when discussing intermediaries and performance as if you commonly replay a stream it probably is coming off of your hard drive.

It is also important to note that you should **never** bookmark links aside from the head of the stream resource. You should always be following links to get to things. We may in the future change how our internal linkings are working. If you bookmark things other than the head you will break in these scenarios.

## Reading All Events

There is a special paged feed for all events that is named `$all`. The same paged form of reading described above can be used to read all events for the entire node by pointing the stream at `/streams/$all`. As it is just a stream in the system, all other things can be done with it (e.g. headers/embed body/etc). You are not however allowed to post to this stream.

<span class="note">
To access the `$all` stream, you must provide user details, more information can be found on the [Security](../security) page.
</span>

```
curl -i http://127.0.0.1:2113/streams/%24all -H "Accept:application/vnd.eventstore.atom+json" -u admin:changeit
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "25159393;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:19:09 GMT
Content-Length: 12157
Keep-Alive: timeout=15,max=100

{
  "title": "All events",
  "id": "http://127.0.0.1:2113/streams/%24all",
  "updated": "2015-03-13T16:19:06.548415Z",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": false,
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/%24all",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/%24all/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/%24all/00000000000000000000000000000000/forward/20",
      "relation": "last"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/%24all/00000000017BC0D000000000017BC0D0/backward/20",
      "relation": "next"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/%24all/0000000001801EBF0000000001801EBF/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/%24all/metadata",
      "relation": "metadata"
    }
  ],
  "entries": <SNIP>
```

## Conditional Gets

The head link also supports conditional gets through the use of ETAGS. The use of ETAGS is a well known HTTP construct described [here](http://en.wikipedia.org/wiki/HTTP_ETag). The basic idea is that you can include the ETAG of your last request and issue a conditional `get` to the server. If nothing has changed it will not return the full feed. As an example consider we make the request:

```
curl -i http://127.0.01:2113/streams/account-28l -H "Accept:application/vnd.eventstore.atom+json"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "180;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:23:52 GMT
Content-Length: 11095
Keep-Alive: timeout=15,max=100

<SNIP>
```

The server has told us in the headers that the ETag for this content is `ETag: "180;248368668"`. We can use this in our next request if we are polling the stream for changes. We will put it in the header If-None-Match. This tells the server to check if the response will be the one we already know. 

```
curl -i http://127.0.0.1:2113/streams/account-28 -H "Accept:application/vnd.eventstore.atom+json" -H "If-None-Match:180;248368668"
```

```http
HTTP/1.1 304 Not Modified
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Content-Type: text/plain; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:27:53 GMT
Content-Length: 0
Keep-Alive: timeout=15,max=100
```

When we do the conditional GET we will be returned a 304 not modified. If however the tags have changed it will be returned as normal. This can optimize not sending large streams over the wire if there have not been changes to the stream.

<span class="note">
Etags are created using the version of the stream and the media type you are reading the stream in. You can NOT take an etag from a stream in one media type and use it with another media type.
</span>

## Embedding Data into Stream

Up until now the feeds that have come down have contained links that point back to the actual event data. This is normally a preferable mechanism for a few reasons. The first is that they can be in a different media type than the feed and can be negotiated separately than the feed itself (e.g. feed in JSON event in XML). They can also be cached separately from the feed and can be pointed to by many feeds (if you use a `linkTo()` in projections this is actually what happens in your atom feeds). You can however also tell the atom feeds to embed your events into the stream as opposed to providing links. This can help cut down on the number of requests in some situations but the messages will be larger. Embedding is only supported in JSON.

Though these are mostly used by the StreamUI component in the webapi at present there are ways of embedding events and/or further metadata into your stream that are controlled by the `embed=` parameter.

### Rich

The Rich embed mode will return more properties about the event (eventtype, streamid, position, etc) as can be seen in the following request.

```
curl -i -H "Accept:application/vnd.eventstore.atom+json" "http://127.0.0.1:2113/streams/newstream2?embed=rich"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "0;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:30:57 GMT
Content-Length: 1570
Keep-Alive: timeout=15,max=100

{
  "title": "Event stream 'newstream2'",
  "id": "http://127.0.0.1:2113/streams/newstream2",
  "updated": "2015-03-13T12:13:42.492473Z",
  "streamId": "newstream2",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": true,
  "selfUrl": "http://127.0.0.1:2113/streams/newstream2",
  "eTag": "0;248368668",
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/1/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/metadata",
      "relation": "metadata"
    }
  ],
  "entries": [
    {
      "eventId": "fbf4a1a1-b4a3-4dfe-a01f-ec52c34e16e4",
      "eventType": "event-type",
      "eventNumber": 0,
      "streamId": "newstream2",
      "isJson": true,
      "isMetaData": false,
      "isLinkMetaData": false,
      "positionEventNumber": 0,
      "positionStreamId": "newstream2",
      "title": "0@newstream2",
      "id": "http://127.0.0.1:2113/streams/newstream2/0",
      "updated": "2015-03-13T12:13:42.492473Z",
      "author": {
        "name": "EventStore"
      },
      "summary": "event-type",
      "links": [
        {
          "uri": "http://127.0.0.1:2113/streams/newstream2/0",
          "relation": "edit"
        },
        {
          "uri": "http://127.0.0.1:2113/streams/newstream2/0",
          "relation": "alternate"
        }
      ]
    }
  ]
}
```

### Body

The body embed parameter will put the JSON/XML body of the events into the feed as well depending on the type of the feed. This can be seen in the following HTTP request (note the field “data” that is added).

```
curl -i -H "Accept:application/vnd.eventstore.atom+json" "http://127.0.0.1:2113/streams/newstream2?embed=body"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "0;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:32:06 GMT
Content-Length: 1608
Keep-Alive: timeout=15,max=100

{
  "title": "Event stream 'newstream2'",
  "id": "http://127.0.0.1:2113/streams/newstream2",
  "updated": "2015-03-13T12:13:42.492473Z",
  "streamId": "newstream2",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": true,
  "selfUrl": "http://127.0.0.1:2113/streams/newstream2",
  "eTag": "0;248368668",
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/head/backward/20",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/1/forward/20",
      "relation": "previous"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream2/metadata",
      "relation": "metadata"
    }
  ],
  "entries": [
    {
      "eventId": "fbf4a1a1-b4a3-4dfe-a01f-ec52c34e16e4",
      "eventType": "event-type",
      "eventNumber": 0,
      "data": "{\n  \"a\": \"1\"\n}",
      "streamId": "newstream2",
      "isJson": true,
      "isMetaData": false,
      "isLinkMetaData": false,
      "positionEventNumber": 0,
      "positionStreamId": "newstream2",
      "title": "0@newstream2",
      "id": "http://127.0.0.1:2113/streams/newstream2/0",
      "updated": "2015-03-13T12:13:42.492473Z",
      "author": {
        "name": "EventStore"
      },
      "summary": "event-type",
      "links": [
        {
          "uri": "http://127.0.0.1:2113/streams/newstream2/0",
          "relation": "edit"
        },
        {
          "uri": "http://127.0.0.1:2113/streams/newstream2/0",
          "relation": "alternate"
        }
      ]
    }
  ]
}
```

If you try this in XML then no additional data is embedded, as embedding is only supported with json.

```
curl -i -H "Accept:application/atom+xml" "http://127.0.0.1:2113/streams/newstream2?embed=body"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER, Authorization, ES-LongPoll, ES-ExpectedVersion, ES-EventId, ES-EventType, ES-RequiresMaster, ES-HardDelete, ES-ResolveLinkTo, ES-ExpectedVersion
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ES-Position
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "0;-1296467268"
Content-Type: application/atom+xml; charset=utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 13 Mar 2015 16:32:56 GMT
Content-Length: 929
Keep-Alive: timeout=15,max=100
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
   <title>Event stream 'newstream'</title>
   <id>http://127.0.0.1:2113/streams/newstream</id>
   <updated>2013-06-29T15:12:53.570125Z</updated>
   <author>
      <name>EventStore</name>
   </author>
   <link href="http://127.0.0.1:2113/streams/newstream" rel="self" />
   <link href="http://127.0.0.1:2113/streams/newstream/head/backward/20" rel="first" />
   <link href="http://127.0.0.1:2113/streams/newstream/0/forward/20" rel="last" />
   <link href="http://127.0.0.1:2113/streams/newstream/1/forward/20" rel="previous" />
   <link href="http://127.0.0.1:2113/streams/newstream/metadata" rel="metadata" />
   <entry>
      <title>0@newstream</title>
      <id>http://127.0.0.1:2113/streams/newstream/0</id>
      <updated>2013-06-29T15:12:53.570125Z</updated>
      <author>
         <name>EventStore</name>
      </author>
      <summary>event-type</summary>
      <link href="http://127.0.0.1:2113/streams/newstream/0" rel="edit" />
      <link href="http://127.0.0.1:2113/streams/newstream/0" rel="alternate" />
   </entry>
</feed>
```
There are two other modes are just variants of body. There is PrettyBody which will try to reformat the JSON to make it “pretty to read” and there is TryHarder that will work even harder to try to parse and reformat JSON from an event to allow it to be returned in the feed. These do not however include further information, they are focused on what the feed looks like. 