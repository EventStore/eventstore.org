---
title: "Event Store 3.0.1 Released"
date: 2014-10-28T12:00Z
author: "James Nugent"
layout: blog-post
---

Hot on the heels of version 3.0.0, which was released at our Birthday Party in London on September 17th, 2014, we’re pleased to announce a service release of Event Store, version 3.0.1. This fixes a number of small bugs and updates the bundled version of the uder interface. The release notes are below.

###Event Store Server

- macOS binaries are now compatible with macOS 10.7 and above (#275)
- Gossip can be requested as `application/xml` or `text/xml` in addition to `application/json` (#275)
- It is no longer required to specify an event type when posting stream metadata, it is assumed to be `$settings`
- `X-Forwarded-Port` and `X-Forwarded-Proto` are now supported to enable easier reverse proxying of the Event Store (#244)
- Link events are now served correctly when content is embedded in atom feeds (#228)
- Garbage collection flags on the shell script for starting nodes on Linux and Windows are removed as no longer necessary (#271)
- Metadata streams no longer have a link to themselves for metadata.
- Bundled UI is now from EventStore/EventStore.UI commit
    - UI is bundled and minified, making the binary distribution signficantly smaller when unpacked
    - Some stray development text removed (#252)
    - Resolved issue with projections detail sometimes not displaying (#227)
    - UI now displays linked events correctly (#226)
    - UI indicates events which are invalid due to windowing or deletion (#269)
    - UI no longer presents non-existent metadata stream for the synthesized `$all` stream (#284)

###ES Query

- Content length is now set correctly on some requests from ESQuery which were previously calling failures (#283)

###.NET Client API

- Client-side subscription queue is now bounded (#246)
- EventStore.EmbeddedClient package now has the dependency on EventStore.Client correctly set (#242)
- Embedded client now exposes the correct types for `ResolvedEvent` rather than `ResolvedIndexEvent` (#286)
- Embedded client now includes necessary files for the Projections environment
