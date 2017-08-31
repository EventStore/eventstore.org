---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Caching"
section: "Server"
version: 3.1.0
---

Its very important to note how caching works in Event Store or else you can wind up in some interesting (and confusing) situations especially when you are in a development environment as opposed to in production.

Most of the URIs that Event Store puts out are immutable (including the UI, Atom Feeds, etc). An example of this can be seen in atom. There is a uri that represents an event say /streams/foo/0 representing event 0. The data for event 0 will never change. If this stream is open to public reads then the uri will be set to be cacheable for long periods of time. A similar example can be seen in reading a feed, if a stream has 50 events in it the feed page 20/forward/10 will never change it will always be events 20-30. Iternally Event Store controls serving the right uris by using rel links with feeds (example prev/next).

This caching behavior is great for performance in a production environment and is highly recommended. In a developer environment it can be quite confusing.

What would happen for instance if I brought up a database wrote /streams/foo/0 then did a GET. This GET is cacheable and now in my cache...

Since I am in development I now shutdown and delete my database. I then bring it back up and write a different event to /streams/foo/0. I now open up my browser and look at the /streams/foo/0 .... and I will see the event I wrote before I deleted my database. This has led to much confusion for developers including one wondering how we were managing to still have his old data even though he deleted the entire VM. Though we would like to take credit for such magic it was actually just browser caching.

To avoid this its best to run with the --disable-http-caching command line option. This will disable all such caching and alleviate the issue. If you are running on a version that does not support this command line option you can also change ports when you start a new db this will make sure that you end up with different uris. As a last resort you can also delete your cache in your browser, keep in mind for this option that especially in the cloud the browser may not be the only intermediary cache.