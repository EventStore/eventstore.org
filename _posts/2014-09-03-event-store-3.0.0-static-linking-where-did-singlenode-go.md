---
title: "Event Store 3.0.0 - Static Linking & Where Did SingleNode Go?"
date: 2014-09-03T12:00Z
author: "James Nugent"
layout: blog-post
---

<p class="lead">As we gear up to launch version 3.0.0 of Event Store <a href="/two-years-on">at our annual birthday
party (which you should totally come
to!)</a>, we decided it would be a good
idea to run a short series of articles describing some of the new features and
changes for those who haven't seen them. If there are things you want to know
about in particular, please get in touch on Twitter,
<a href="https://twitter.com/geteventstore">@geteventstore</a></p>

##Where did SingleNode go?

Most people using the open source stable releases of Event Store have been used to running the `EventStore.SingleNode.exe` executable. Commercial customers on the other hand were used to running with a manager node and `EventStore.ClusterNode.exe`. When we originally open-sourced the high-availability clustering back in 2013, this distinction was maintained (and indeed was there in release candidate 2).

As of the latest release candidate, however, observant users will have noticed that the familiar single node executable is no more, and instead there's a single executable named `EventStore.ClusterNode.exe`. In order to reduce code duplication (especially around options parsing), we decided it would be better to have the cluster node configure itself as a single node by default rather than maintaining two separate applications which basically only differed in wireup.

##Static Linking

We originally developed Event Store to run on Windows or Linux, via .NET or Mono respectively. When we first launched, it was necessary to use a custom version of Mono as there was outstanding patches which were not applied in any stable release. Even today it is necessary to build Mono from source to stick with the latest versions on many platforms.

Consequently we recently put some effort into statically linking Mono, not only on Linux but also on macOS (which previously required building from source in order to run 64 bit Mono). Fortunately Mono has a relatively nice way of making a bundle and then statically linking the framework so that the only external system dependency is `glibc`. Hopefully there'll be something this nice for making Windows binaries one day!

You can check out the statically linked packages by [downloading Event Store v3.0.0-rc9](/downloads) for Linux or macOS. For those interested in how to bundle and statically link Mono, the [scripts are part of our open-source repository](https://github.com/EventStore/EventStore/blob/dev/scripts/package-mono/package-mono.sh#L115-121)!
