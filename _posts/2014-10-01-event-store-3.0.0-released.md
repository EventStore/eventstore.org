---
title: "Event Store 3.0.0 Released"
date: 2014-10-01T12:00Z
author: "James Nugent"
layout: blog-post
category: 'Release Notes'
---

As many people know, we released version 3.0.0 of Event Store at our birthday party in London on September 17th, 2014. Traditionally when we've released, we've posted the release notes here - but better late than never!

##Headline features

- Version 3.0.0 supports quorum-based high availability clustering.
- In-memory mode allows the Event Store to run without writing to disk.
- Embedded mode allows hosting of the Event Store in your own processes.
- New UI which uses HTML5 and JavaScript to access the public API of the Event Store.
- Binaries for macOS and Linux are statically linked with Mono; no runtime installation is required.
- Support for soft-deleting streams, allowing a new stream with the same name to be recreated later as the default.

##Breaking changes

- A number of messages in the client API protocol have changed - only client APIs designed for version 3 of Event Store should be used with a version 3 server.
- Synchronous overloads of methods are no longer available in the .NET client API.
- `EventStore.SingleNode.exe` has been removed in favour of a reconfigured `EventStore.ClusterNode.exe` which runs as a single node if a larger cluster size is not specified.
- Deletes over HTTP and the Client API protocol now default to soft-deletion.
- Configuration files are now written in YAML instead of JSON.
- Default configuration file locations are no longer assumed.
- Introduced new media types, `application/vnd.eventstore.events+json` and `application/vnd.eventstore.events+xml` for the previous syntax which mixes request metadata with event metadata and data in request bodies.
- `POST` requests to a stream with the media type `application/json`, `application/xml` or `text/xml` assume a single event is contained in the body. Event ID and expected version can be specified via headers on the request, or an idempotent URI can be posted to allow for retries if client-side ID generation is not possible.

##Other changes

- Options parsing now uses PowerArgs instead of NDesk.Options, which allows options to be specified in a wider variety of ways.
- Fixed bugs with reading link events pointing to events which no longer exist because of $maxCount, $truncateBefore or stream deletion.
- All necessary CORS headers to run the new user interface (see EventStore/EventStore.UI) are now allowed.
- Fixed failover of projections in a clustered environment.
- Added configurable timeouts for gossip in a cluster.
- Added a new overload for gossip seeds which allows a host header to be set if necessary in the Client API.
- Creating performance counters in Windows is now retried in the case of failure.
- Verifying database files now uses unbuffered IO on Windows in order to avoid causing the file cache to fill up immediately.
- `esquery` tool allows basic evaluation of queries and to subscribe to streams via a REPL.
- Fixed a bug which could allow records which were larger than the size limit to be written to the database and subsequently report a corrupted database.
- Projections support distributed map-reduce in a cluster.
- More information (e.g. timestamp) is available to Client APIs about events on read.
- Certificates can now be loaded from a Windows certificate store by thumbprint.
- Effective configuration can be determined by using the `-WhatIf` or `--what-if` flags to terminate immediately after resolving the configuration.
- Various other minor bug fixes.
- Internal and external heartbeat timeouts and intervals can now be independently set.

