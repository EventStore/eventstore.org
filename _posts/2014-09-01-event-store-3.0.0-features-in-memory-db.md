---
title: "Event Store 3.0.0 - In-Memory Mode"
date: 2014-09-01T12:00Z
author: "James Nugent"
layout: blog-post
category: "News"
tags: ["Event Store","Version 3.0"]
---

*As we gear up to launch version 3.0.0 of Event Store at our annual birthday party (which you should totally come to!), we decided it would be a good idea to run a short series of articles describing some of the new features for those who haven’t seen them. If there are things you want to know about in particular, please get in touch on Twitter, [@eventstore](https://twitter.com/eventstore)!*

##In-Memory Mode

One of the common questions about version 2.0.1 of Event Store was how to write tests against it. The new in-memory mode of version 3.0.0 is one part of the answer to that question - at least for integration tests. Unit tests (for example of command handlers) are still likely to be better off testing with a fake version of something like a repository abstraction.

In-memory mode allows for the Event Store server to function normally (including projections and clustering), but with the transaction file and index to be kept entirely in memory instead of writing to disk. This makes it very straightforward to perform integration testing against an actual Event Store server rather than relying on a test double which could have behaviour divergent from that of the server.

In order to start the server in in-memory mode, the `--mem-db` flag can be passed at the command line, `MemDb: true` can be specified in the configuration file, or the `EVENTSTORE_MEM_DB` environment variable can be set to `true` (or `1` since commit `bb8d6a9`).

**Remember that all data is lost when the server terminates when running in-memory mode!!!**
