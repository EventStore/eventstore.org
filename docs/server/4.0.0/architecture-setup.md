---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "HTTP Architecture Setup"
section: "Server"
version: "4.0.0"
---

## Authentication Options

When setting up the Event Store there are two main options for authentication, either you lock down the entire Event Store, or you use per-stream [Access Control Lists](../access-control-lists) to give more fine grained control on which users can see which data.

### Lock Down Whole Event Store

To lock down the whole Event Store, you would bind the server to the localhost (127.0.0.1) interface. Then install a reverse proxy such as [nginx](http://nginx.org) or [Varnish](https://www.varnish-cache.org) on the public IP. An example of setting up the Event Store with Varnish can be found [here](../setting-up-varnish-in-linux).

The reverse proxy will be your public interface. Internally it will handle the authenticaion and route requests to the Event Store. The Event Store is only accessible through the localhost adapter and is not exposed publicly. The locally running reverse proxy will also be allowed to cache responses, because of this reverse proxies will be much more performant than calling into the Event Store directly.

### Lock Down Streams with ACLs

The Event Store supports internal authentication, if you want to use this then you can expose the Event Store directly on a port. In this situation all Authentication will be handled by the Event Store. 

As the Event Store itself is handling all security requests it will have all information about users. This information can be used to check Access Control Lists of streams to allow for very fine grained control of security. This will however cause many more requests to be served internally by the Event Store and thus will be less performant.

<span class="note">Per-stream access control lists require setting caching to private to ensure data is not cached in a shared cache, see [here](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1)</span>

### Hybrid Option

Even if using a reverse proxy in a trusted solution, as above, you can support external authentication from the Event Store itself. This can be done by turning on the trusted intermediary option in your config. This allows the intermediary to write a header with the user information that the Event Store will use. There is further discussion on this in the [HTTP headers section](../../../http-api/Optional-Http-Headers).

## Security with SSL

### Windows

Setting up SSL in windows is the same as setting up any httplistener in windows for SSL. Numerous examples of this can be found online and below we have linked to one example.

From [Damir Dobric](http://developers.de/blogs/damir_dobric/archive/2006/08/01/897.aspx)

### Linux

Setting up SSL in Linux is the same as setting up any mono httplistener in Linux for SSL. Numerous examples of this can be found online and below we have linked to one example. This methodology will likely work for other systems such as openbsd as well.

From [Joshua Perina](http://joshua.perina.com/geo/post/using-ssl-https-with-mono-httplistener).
