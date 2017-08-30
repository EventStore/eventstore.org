---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Security"
section: "HTTP API"
version: 3.0.0
---

The Event Store supports security over HTTP. This document is meant as an introduction to how the security is implemented.

## Authentication

The Event Store supports authentication over basic authentication to internal users. These users can be created either through a RESTful API or through the admin console. Once users are configured standard basic authentication can be used on requests.

<span class="note">
The trusted intermediary header can also be used to provide for externalized authentication, you can read more about it [here](../optional-http-headers/trusted-intermediary) this can allow you to easily integrate almost any authentication system with the Event Store.
</span>

As an example if I were to use the default admin user `admin:changeit` I would include this in my request.

```
ouro@ouroboros:~/src/EventStore.wiki$ curl -i 'http://127.0.0.1:2113/streams/$all' -u admin:changeit
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Methods: POST, DELETE, GET, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Cache-Control: max-age=0, no-cache, must-revalidate
Vary: Accept
ETag: "28334346;248368668"
Content-Type: application/vnd.eventstore.atom+json; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Thu, 04 Jul 2013 00:13:59 GMT
Content-Length: 12212
Keep-Alive: timeout=15,max=100
```

If I were to use the wrong user or no user where one was required I would end up with a 401 Unauthorized.

```
greg@ouroboros:~/src/EventStore.wiki$ curl -i 'http://127.0.0.1:2113/streams/$all' -u admin:password
```

```http
HTTP/1.1 401 Unauthorized
Access-Control-Allow-Methods: POST, DELETE, GET, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
WWW-Authenticate: Basic realm="ES"
Content-Type: text/plain; charset: utf-8
Server: Mono-HTTPAPI/1.0
Date: Thu, 04 Jul 2013 00:20:34 GMT
Content-Length: 0
Keep-Alive: timeout=15,max=100
```

As the username and password are being passed as part of the request it is not recommended that you run the Event Store over http if you are using authentication. Instead you should enable SSL in order to encrypt the user information. Instructions can be found in this wiki for how to accomplish this in [Windows](../setting-up-ssl-in-windows) and [Linux](../setting-up-ssl-in-linux). If you are running the clustered version you can also setup SSL for the replication protocol.

## Access Control Lists

Along with authentication the Event Store also supports per stream configuration of Access Control Lists (ACL). In order to configure the ACL of a stream you should go to its head and look for the metadata relationship link to obtain the metadata for the stream.

```json
    {
      "uri": "http://127.0.0.1:2113/streams/%24all/metadata",
      "relation": "metadata"
    }
```

To set access control lists over http you can post to the metadata stream just like setting any other metadata. You can also set Access Control Lists for a stream in the web UI. When on a stream.

For more information on the structure of how Access Control Lists work please see [Access Control Lists]({{ site.url }}/server/latest/access-control-lists).