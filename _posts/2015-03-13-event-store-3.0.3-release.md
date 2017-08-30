---
title: "Event Store 3.0.3 Released"
date: 2015-03-13T12:00Z
author: "James Nugent"
layout: blog-post
---

Hot on the heels of Event Store 3.0.2 last week is Event Store 3.0.3, which contains a fix for a problem some users experienced when scavenging databases with large numbers of merged transaction file chunks. There is no immediate need to upgrade for those using 3.0.2, though it's recommended anyone using any earlier version should upgrade if possible.

The release notes for Event Store 3.0.3 are below.

Event Store Server
------------------

- Fixed a bug which could cause an infinite loop during scavenging when more than 10 chunks had previously been merged.
