---
layout: blog-post
title: How to avoid Dirty Reads with Event Store
author: Riccardo Di Nuzzo
---
Dirty Reads are not common but are possible with the default configuration. In this article we'll discuss why and consider how to avoid them.

In brief, when a write is sent to an Event Store cluster, the master will write the events and replicate them to the other nodes in the cluster. The master will then wait for a quorum of nodes (cluster_size/2 + 1) to acknowledge the write before considering the write successful.

In other words in a cluster of 3 nodes the quorum is 2 nodes. Before the Master can send back the acknowledge to the client it needs to wait the confirmation of write from at least 1 Slave node. For that reason **it is possible that a client can read from the other node that is not updated yet with the latest write**. This situation is defined as “Dirty Read”.

If you must ensure that a client will always read the latest version of your data then you can...

If you use the .net client api: use the connection setting\
`PerformOnMasterOnly`

If your client doesn’t provides this method use the connection string setting \
`require-master=true`

In conclusion the possibility to get a Dirty Read depends on connection settings and if it can be read from any or read only from master.

Hope this helps

Riccardo
