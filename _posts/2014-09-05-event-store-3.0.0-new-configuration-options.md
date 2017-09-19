---
title: "Event Store 3.0.0 - Configuration Changes"
date: 2014-09-05T12:00Z
author: "James Nugent"
layout: blog-post
---

<p class="lead">As we gear up to launch version 3.0.0 of Event Store at our annual birthday party (which you should totally come to!), we decided it would be a good idea to run a short series of articles describing some of the new features and changes for those who haven’t seen them. If there are things you want to know about in particular, please get in touch on Twitter, <a href="https://twitter.com/eventstore">@eventstore</a></p>

##Configuration Changes

Since version 1 of Event Store we've supported setting configuration options in
a variety of ways to suit a range of different use cases - either from the
command line, from a configuration file or from environment variables. The
original code that handled this was particularly hairy, and has been subject to
a complete rewrite in version 3 (thanks originally to a great open-source
contribution by [Pieter](http://pieterg.com), who is now part of the Event
Store team!)

This post will outline the user perspective on how configuration works and what
has changed - there'll also be some links to the code for those interested!

###Option Precedence

All sources of configuration are evaluated, and the effective configuration
chosen as a result of the following precedence list (as of
[c4336c23](https://github.com/EventStore/EventStore/commit/c4336c234f15a2bf3807ec6960031015f8ceac83)):

- Command Line Parameter (Most important)
- Environment Variable
- Configuration File
- Default (Least important)

Consequently, if you have, for example, `Db: /home/Ouro/myDb/` in the
configuration file, but also pass in `--db /tmp/random`, the effective value
will be `/tmp/random` as the command line has a higher precedence than the
configuration file.

###Testing a Configuration

Event Store writes the running config to the logs each time it starts. However,
when testing it can be useful to know what the effective config will be without
actually doing anything. Following Powershell's lead therefore, we added a
`-WhatIf` option (or `--what-if` if you prefer) which runs the Event Store to
the point it would output the configuration and then exits.

###Configuration Formats

The configuration file format for versions 1 and 2 (and v3-rc2) of Event Store
was JSON. However, this was a particularly nasty file format which didn’t allow
inline comments and caused Windows users issues with paths. As of v3-rc9, the
configuration file format has been changed to YAML, which is more suitable for
configuration.

*Note: YAML is case-sensitive, so the options have to be capitalized in the
configuration file. The output of `EventStore.ClusterNode.exe --help` or
`./clusternode --help` show the options in the correct format for the
configuration file.*

A typical configuration file to run a single node Event Store on the default
ports on an external interface might look like this:

```yaml
# Database and logs path
Db: /home/Ouro/myDb

# Bind external interface to external IP address
ExtIp: 192.168.1.2

# Leave port defaults alone

# Run all projections
RunProjections: All
```

###Default Config Files

The idea of a default configuration file path for a node has gone in version 3
- it caused too many issues when trying to run a cluster of three nodes on the
same box (for example, for integration testing). Consequently it is required to
specify the location of the configuration file either by passing `--config
/path/to/config` on the command line or by setting the `EVENTSTORE_CONFIG`
environment variable to the file path if you only have one node running on the
box.
