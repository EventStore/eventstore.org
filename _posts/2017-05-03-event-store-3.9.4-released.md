---
title: "Event Store 3.9.4 Released"
author: "Event Store Team"
layout: blog-post
category: 'Release Notes'
---

# Overview

Today we have released Event Store 3.9.4. This version is able to understand the changes made in Event Store 4.0.0, and can therefore be run alongside 4.0.0 nodes for the purpose of a rolling upgrade.

# What's changed in 3.9.4?

- 3.9.4 is able to understand the new record and index entry versions written by Event Store 4.0.0, particularly the changes around converting ints to longs for Stream Versions.
- Add support for X-Forwarded-Prefix headers
- Add option for disabling insecure TCP
- Amend the prepare position returned from a read all events

There are no client or UI changes for Event Store 3.9.4

# Can I roll back from 3.9.4 to 3.9.x?

Event Store 3.9.4 writes the same version of index entry as 4.0.0, and the indexes are therefore not compatible with older Event Store versions.
As such you will need to delete the indexes written by 3.9.4 before you can roll back to 3.9.x. You might want to back up your 3.9.x indexes before upgrading to 3.9.4 so that if you do want to roll back, you can restore these indexes instead of rebuilding them from scratch.

If you have upgraded a node to 4.0.0, you will not be able to rollback to any Event Store version less than 3.9.4.

# How do I upgrade my cluster?

Event Store 3.9.4 is intended to be used for a rolling upgrade from a 3.9.x node to 4.0.0. You can do this as follows:
Take down a node in a cluster and upgrade the node to 3.9.4. Repeat this on each node in the cluster until all nodes are running 3.9.4.
Repeat this process, upgrading each node to 4.0.0.

# Will I have to upgrade my clients?

There is no client release with 3.9.4. Existing clients will be able to work with this release, as well as 4.0.0 clients.

# I have run into an issue, please help?

You can reach out to us over at our [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store). If you have a support contract, please contact us via the official support channel.