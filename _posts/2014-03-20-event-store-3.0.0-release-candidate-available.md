---
title: "Event Store 3.0.0 Release Candidate available"
date: 2014-03-20T12:00Z
author: "James Nugent"
layout: blog-post
---

It's been quite a while since our last binary release, a fact which has been commented on by many people on Twitter! However, after a good few months of work, we're finally "done" with version 3 (with some caveats below)! What we've made available today is a public Release Candidate of what we hope to become version 3.0.0 of Event Store.

*tl;dr - You can get the bits <a href="/downloads"/>here</a>. Make sure to stop any projections running in the previous version and start them again with the new version to avoid any issues with recovery.*

##What's in the box?

As many people are aware, we decided to open-source high availability clustering under the same permissive license under which the single node Event Store was previously available (we made the announcement at DDD Exchange New York last year). This is the first binary release to include the cluster as well as the single node variants of Event Store.

Another major thing we're shipping for the first time is the ability to run the Event Store entirely in memory, which is great if you want to write integration tests against the actual server (or cluster) without having to clean up after your tests have run.

We're also releasing binaries that work on the Mac for the first time. Although you'll still need Mono installed (for now), this is still a significant improvement over trying to build the native dependencies yourself.

The wire protocol has had minor (additive changes), and whilst older versions of the client will continue to work with newer versions of the server, there's a new client API package up on NuGet for those on .NET.

There are some major changes under the hood of projections which we'll describe in more depth in some future posts. They are still, however, in beta and it's anticipated that they will still be in beta when version 3.0.0 is released.

There have been over 500 commits since our last release. We're preparing a full set of release notes at the moment in anticipation of a full (non-RC) release shortly.

##What's still to do?

We're currently experiencing problems with the mono garbage collector failing under heavy load. Ideally we'd like to get this resolved before a final release, but the native stack traces being produced are deep inside sgen. We're working with the mono team to get this resolved, but be aware that it's advisable to run under mono with a supervisor (for example, <a href="http://supervisord.org">supervisord</a>) in case of crashes.

Another issue we're aware of and will be resolving before the release is the forwarding of some projections commands from a slave node to the master node. This is mostly a UI problem, and does not affect the internal working of projections. The workaround at this point is to issue commands on the UI of whichever node is currently master. This will be fixed prior to the release of v3.0.0.

If you find anything else, please <a href="https://groups.google.com/forum/#!forum/event-store">let us know!</a>!

##What are we doing next?

The big feature we're working on next is a complete new UI. Our friend Jakub Gutkowski has made an excellent start with this, and we're hoping to get it out soon (no-one knows our current UI sucks as much as we do!). We also hope to have projections out of beta soon.

If you have any feedback at all on the release candidate, please let us know either on the <a href="https://groups.google.com/forum/#!forum/event-store">Google group</a> or on <a href="https://twitter.com/eventstore">Twitter</a>!
