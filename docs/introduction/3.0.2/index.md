---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Getting Started"
section: "Introduction"
pinned: true
version: "3.0.2"
---

This document describes how to get started with the Event Store providing you are interested in using Atom as your primary interface. We will cover installation of the Event Store and taking you through the basic operation such as writing to a stream, reading from a stream, and subscribing to a stream.

<span class="note--warning">
This setup is intended as an experimental setup or for a developer’s machine. It is not intended to describe a production setup. This document assumes that you also have [cURL](http://curl.haxx.se) installed on your machine.
</span>

## Installation

To start go to [/downloads](/downloads) and download the binaries into a folder. For this document it is assumed that you are in Windows. If you are in linux or in another environment the Event Store likely works there but you will have to follow further instructions for setup.

Once you have the zip file unzipped open up an administrator console. `cd` into the directory where you have installed the Event Store. On the command line enter:

```
EventStore.ClusterNode.exe --db ./db --log ./logs
```

This will start the EventStore and will put the database in the path `./db` and the logs in `./logs`. You can view further command line arguments in the [server docs](/docs/server) (there are many!). It is important to note that it is being run in an admin context because it will start a HTTP server through http.sys. If you were to be running in a more permanent situation you would probably want to provide for an ACL in windows such as:

```
netsh http add urlacl url=http://+:2113/ user=DOMAIN\username
```

The Event Store should be now up and running on your machine. You can browse to [http://127.0.0.1:2113/](http://127.0.0.1:2113) to see the admin console. The console will ask for a username and password. By default it is `admin:changeit`.

## Writing Events to an Event Stream

The first operation we will look at is how to write to a stream. The Event Store operates on a concept of Event Streams. These are partition points in the system. If you are Event Sourcing a domain model a stream would equate to an aggregate. The Event Store can easily handle hundreds of millions of streams. Don’t be afraid to make many of them.

To begin let’s open Notepad. Copy and paste the following event definition into Notepad and save it as `event.txt`.

```json
[
  {
    "eventId": "fbf4a1a1-b4a3-4dfe-a01f-ec52c34e16e4",
    "eventType": "event-type",
    "data": {

      "a": "1"
    }
  }
]
```

<span class="note">
You can also post events as XML in the same format but set the `Content-Type` to `XML`.
</span>

Now to write our event to a stream we would issue the following cURL command.

```
curl -i -d @event.txt "http://127.0.0.1:2113/streams/newstream" -H "Content-Type:application/json"
```

<span class="note">
From version 3.0.0 RC9 there has been a change to how events are posted. See the [post about this release here](https://groups.google.com/forum/#!searchin/event-store/rc9/event-store/hLFyG32Yui8/NHql6R4rw-QJ).
</span>

For the above to work use the following which has a new `Content-Type` which allows the old format:

```
curl -i -d @event.txt "http://127.0.0.1:2113/streams/newstream" -H "Content-Type:application/vnd.eventstore.events+json"
```

This gives the following result:

```http
HTTP/1.1 201 Created
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Location: http://127.0.0.1:2113/streams/newstream/0
Content-Type: text/plain; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Fri, 28 Jun 2013 12:17:59 GMT
Content-Length: 0
Keep-Alive: timeout=15,max=100

```

If you go to your UI after this command and to the *Streams* tab. You will see your stream has recently been created. If you post to a stream that doesn’t exist the Event Store will create it. You can then click on it to get an HTML representation of your stream (or you can navigate directly to [http://127.0.0.1:2113/web/index.html#/streams/newstream](http://127.0.0.1:2113/web/index.html#/streams/newstream)).

You can also setup Access Control Lists (see [server docs](/docs/server/latest)) on your streams by changing the metadata of the stream.

## Reading From a Stream

Reading from a stream is quite easy as all streams are exposed as [atom feeds](http://tools.ietf.org/html/rfc4287). Many environments have an existing method for reading atom feeds. 

Let’s try to get the data out of our stream. Just like with our browser we will navigate to the *head* URI of the stream http://127.0.0.1:2113/streams/newstream. We can do this with cURL.

```
curl -i -H "Accept:application/atom+xml" "http://127.0.0.1:2113/streams/newstream"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "0;-1296467268"
Content-Type: application/atom+xml; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Sat, 29 Jun 2013 18:02:21 GMT
Content-Length: 998
Keep-Alive: timeout=15,max=100

<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
   <title>Event stream 'newstream'</title>
   <id>http://127.0.0.1:2113/streams/newstream</id>
   <updated>2013-06-29T14:45:06.550308Z</updated>
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
      <updated>2013-06-29T14:45:06.550308Z</updated>
      <author>
         <name>EventStore</name>
      </author>
      <summary>event-type</summary>
      <link href="http://127.0.0.1:2113/streams/newstream/0" rel="edit" />
      <link href="http://127.0.0.1:2113/streams/newstream/0" rel="alternate" />
   </entry>
</feed>
```

This cURL command told the system that we wanted the feed returned to us in `atom+xml` *(pro tip: you can also try `application/vnd.eventstore.atom+json` if you prefer JSON like we do!)*. The feed that we pulled has a single item inside of it—the one we recently posted. We would then get the event by issuing a `GET` to the alternate URI.

```
curl -i http://127.0.0.1:2113/streams/newstream/0 -H "Accept: application/json"
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Cache-Control: max-age=31536000, public
Vary: Accept
Content-Type: application/json; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Wed, 03 Jul 2013 11:09:12 GMT
Content-Length: 14
Keep-Alive: timeout=15,max=100

{
  "a": "1"
}
```

This will return our event that we had originally posted. You can also get your event as XML (set `Accept: text/xml`). In order to read a single page feed we would just get the feed and then iterate through the event links executing gets. This may feel inefficient at first but remember the event URIs and most of the page URIs are infinitely cacheable. We can also get the events in the feed itself if prefered by using `?embed=body`. There is further discussion on this [here](/docs/http-api/latest/reading-streams).

Sometimes however your feed may span more than one atom page. In this case you will have to page through the feed. This is done by following the relation links in the feed. To read a feed from the beginning to the end you would go to the *last* link and then continue to read the *previous* page. You can also do more of a twitter style follow and start from now and take the last say 50 to display by using *first* then *next*.

## Subscribing to Stream to get Updates

Another common operation people want to be able to do is to listen to a stream for when changes are occuring. Luckily this works the same way as paging through a feed in Atom. As new events arrive new *previous* links will be created. You can continue following them. The example below includes both paging and subscribing over time. If you wanted to provide an *at least once* assurance with the following code you would simply save the last URI you had received.

If you prefer JavaScript an example can be found in our own source base as we have the ability to run projections in the browser from atomfeeds. You can find the code for this [JavaScript Example](https://github.com/EventStore/EventStore/blob/22fd3562f97037afc256745fe011eabaef62db60/src/EventStore/EventStore.SingleNode.Web/singlenode-web/js/projections/es.projection.js).

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel.Syndication;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;

namespace AtomPoller
{
    class Program
    {
        private static SyndicationLink
GetNamedLink(IEnumerable<SyndicationLink> links, string name)
        {
            return links.FirstOrDefault(link => link.RelationshipType == name);
        }
        static Uri GetLast(Uri head)
        {
            var request = (HttpWebRequest)WebRequest.Create(head);
            request.Credentials = new NetworkCredential("admin", "changeit");
            request.Accept = "application/atom+xml";
            try
            {
                using (var response = (HttpWebResponse) request.GetResponse())
                {
                    if (response.StatusCode == HttpStatusCode.NotFound)
                        return null;
                    using (var xmlreader =
XmlReader.Create(response.GetResponseStream()))
                    {
                        var feed = SyndicationFeed.Load(xmlreader);
                        var last = GetNamedLink(feed.Links, "last");
                        return (last != null) ? last.Uri :
GetNamedLink(feed.Links, "self").Uri;
                    }
                }
            }
            catch(WebException ex)
            {
                if (((HttpWebResponse) ex.Response).StatusCode ==
HttpStatusCode.NotFound) return null;
                throw;
            }
        }

        private static void ProcessItem(SyndicationItem item)
        {
            Console.WriteLine(item.Title.Text);
            //get events
            var request =
(HttpWebRequest)WebRequest.Create(GetNamedLink(item.Links,
"alternate").Uri);
            request.Credentials = new NetworkCredential("admin", "changeit");
            request.Accept = "application/json";
            using (var response = request.GetResponse())
            {
                var streamReader = new
StreamReader(response.GetResponseStream());
                Console.WriteLine(streamReader.ReadToEnd());
            }
        }

        static Uri ReadPrevious(Uri uri)
        {
            var request = (HttpWebRequest)WebRequest.Create(uri);
            request.Credentials = new NetworkCredential("admin", "changeit");
            request.Accept = "application/atom+xml";
            using(var response = request.GetResponse())
            {
                using(var xmlreader =
XmlReader.Create(response.GetResponseStream()))
                {
                    var feed = SyndicationFeed.Load(xmlreader);
                    foreach (var item in feed.Items.Reverse())
                    {
                        ProcessItem(item);
                    }
                    var prev = GetNamedLink(feed.Links, "previous");
                    return prev == null ? uri : prev.Uri;
                }
            }
        }

        private static void PostMessage()
        {
            var message = "[{'eventType':'MyFirstEvent', 'eventId' :
'" +Guid.NewGuid() +"', 'data' : {'name':'hello world!', 'number' : "
+ new Random().Next() + "}}]";
            var request =
WebRequest.Create("http://127.0.0.1:2113/streams/yourstream");
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = message.Length;
            using(var sw= new StreamWriter(request.GetRequestStream()))
            {
                sw.Write(message);
            }
            using(var response = request.GetResponse())
            {
                response.Close();
            }
        }

        static void Main(string[] args)
        {
            var timer = new Timer(o => PostMessage(), null, 1000, 1000);
            Uri last = null;
            Console.WriteLine("Press any key to exit.");
            var stop = false;
            while (last == null && !stop)
            {
                last = GetLast(new
Uri("http://127.0.0.1:2113/streams/yourstream"));
                if(last == null) Thread.Sleep(1000);
                if (Console.KeyAvailable)
                {
                    stop = true;
                }
            }

            while(!stop)
            {
                var current = ReadPrevious(last);
                if(last == current)
                {
                    Thread.Sleep(1000);
                }
                last = current;
                if(Console.KeyAvailable)
                {
                    stop = true;
                }
            }
        }
    }
}
```
