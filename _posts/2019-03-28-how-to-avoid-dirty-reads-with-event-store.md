---
layout: blog-post
title: How to avoid Dirty Reads with Event Store
author: Riccardo Di Nuzzo
---

Dirty Reads are not common but are possible with the default Event Store configuration. In this article I discuss why they occur and how to avoid them.

When a client sends a write to an Event Store cluster, the master writes the events and replicates them to the other nodes in the cluster. The master then waits for a quorum of nodes (cluster size/2 + 1) to acknowledge the write before considering the write successful.

For example, in a cluster of 3 nodes the quorum is 2 nodes. Before the Master can send back acknowledgement to the client, it needs to wait the confirmation of a write from at least 1 Slave node. Because of this, **it is possible that a client can read from the other node that is not yet updated with the latest write**. This situation is called a "Dirty Read".

If you need to ensure that a client always reads the latest version of your data then you can do the following.

## .NET Client

Use the `PerformOnMasterOnly` setting in your [connection string](docs/dotnet-api/connecting-to-a-server/index.html#creating-a-connection):

```csharp
var connectionString = "ConnectTo=tcp://admin:changeit@localhost:1113; PerformOnMasterOnly=True"
```

If your client doesn't provides this method use the connection string setting `require-master=true`:

```csharp

```

## HTTP Client

TBD

In conclusion the possibility of a Dirty Read depends on your connection settings and if the cluster can read from any node, or read only from master.
