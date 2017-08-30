---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Documentation"
---

<p class="docs-lead">Event Store docs are hosted on <a href="https://github.com/eventstore/eventstore.org">GitHub</a>. The repository is public and it’s open to issues and pull requests. Contributions, corrections and feedback are all welcome.</p>

## Using These Docs

Read through the [Introduction](/docs/introduction) section if you’re new to Event Store. If you know what you are looking for navigate to the section and version you need.

### Sharing Links

URLs for documentation pages are version-specific. If you want to share a link that always points to the latest (non pre-release) version you can replace the version number in the URL with “latest”. For example:

- [/docs/http-api/**3.0.0**/security](/docs/http-api/3.0.0/security) always points to version 3.0.0.
- [/docs/http-api/**latest**/security](/docs/http-api/latest/security) always points to the latest stable version.

## Related Blog Posts

The following blog posts talk about the Event Store and may be useful for features that aren’t yet documented here. If you know of any others, please let us know! For more articles by Event Store visit our [blog](/blog).

### Getting Started Series

- [Part 1: Introduction](/blog/20130220/getting-started-part-1-introduction)
- [Part 2: Implementing the CommonDomain repository interface](/blog/20130220/getting-started-part-2-implementing-the-commondomain-repository-interface)
- [Part 3: Subscriptions](/blog/20130306/getting-started-part-3-subscriptions)

### Projections Series

- [Part 1: Projections Theory](/blog/20130212/projections-1-theory)
- [Part 2: A Simple SEP Projection](/blog/20130213/projections-2-a-simple-sep-projection)
- [Part 3: Using State](/blog/20130215/projections-3-using-state)
- [Intermission: A Case Study](/blog/20130217/projections-intermission)
- [Part 4: Event Matching](/blog/20130218/projections-4-event-matching)
- [Part 5: Indexing](/blog/20130218/projections-5-indexing)
- [Part 6: An Indexing Use Case](/blog/20130227/projections-6-an-indexing-use-case)
- [Part 7: Multiple Streams](/blog/20130309/projections-7-multiple-streams)
- [Part 8: Internal Indexing](/blog/20130309/projections-8-internal-indexing)

### Rob Ashton’s Projections Series

- [Part 1: Introduction to the EventStore](http://codeofrob.com/entries/playing-with-the-eventstore.html)
- [Part 2: Pushing data into the EventStore](http://codeofrob.com/entries/pushing-data-into-streams-in-the-eventstore.html)
- [Part 3: Projections in the EventStore](http://codeofrob.com/entries/basic-projections-in-the-eventstore.html)
- [Part 4: Re-partitioning streams in the EventStore](http://codeofrob.com/entries/re-partitioning-streams-in-the-event-store-for-better-projections.html)
- [Part 5: Creating a projection per stream](http://codeofrob.com/entries/creating-a-projection-per-stream-in-the-eventstore.html)
- [Part 6: Pumping data from Github into the EventStore](http://codeofrob.com/entries/less-abstract,-pumping-data-from-github-into-the-eventstore.html)
- [Part 7: Emitting new events from a projection](http://codeofrob.com/entries/evented-github-adventure---emitting-commits-as-their-own-events.html)
- [Part 8: Who is the sweariest of them all?](http://codeofrob.com/entries/evented-github-adventure---who-writes-the-sweariest-commit-messages.html)
- [Part 9: Temporal queries in the event store](http://codeofrob.com/entries/evented-github-adventure---temporal-queries,-who-doesnt-trust-their-hardware.html)
- [Part 10: Projections from multiple streams](http://codeofrob.com/entries/evented-github-adventure---crossing-the-streams-to-gain-real-insights.html)
- [Part 11: Temporal averages](http://codeofrob.com/entries/evented-github-adventure---temporal-averages.html)
- [Part 12: (Aside) Database storage and backing up](http://codeofrob.com/entries/evented-github-adventure---database-storage-and-backing-up.html)
- [Part 13: Sentiment analysis of github commits](http://codeofrob.com/entries/evented-github-adventure---sentiment-analysis-of-github-commits.html)

### Other Posts

- [Ensuring Writes](/blog/20130301/ensuring-writes-multi-node-replication) - describes how writing works in our commercial highly available product.
- [The Cost of Creating a Stream](/blog/20130210/the-cost-of-creating-a-stream)
- [Various Hash Implementations (BSD Licensed!)](/blog/20120921/a-useful-piece-of-code-1)

## Videos

- [Ouro’s 2nd Birthday](/blog/20141112/video-of-ouros-2nd-birthday) introducing Event Store 3.0.0.
- [Greg Young’s “In The Brain” session](http://skillsmatter.com/podcast/design-architecture/event-store-as-a-read-model) about using projections for Complex Event Processing.