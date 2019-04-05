---
layout: blog-post
title: How to avoid Dirty Reads with Event Store
author: Riccardo Di Nuzzo
---

Dirty Reads are not frequent but are possible with the default Event Store configuration. In this article, I discuss why they occur and how to avoid them.

When a client sends a write to an Event Store cluster, the master writes the events and replicates them to the other nodes in the cluster. The master then waits for a quorum of nodes (cluster size/2 + 1) to acknowledge the write before considering the write successful.

For example, in a cluster of 3 nodes, the quorum is 2 nodes. Before the Master can send back an acknowledgment to the client, it needs to wait for the confirmation of a write from at least 1 Slave node. Because of this, **it is possible that a client can read from the other node that is not yet updated with the latest write**. This situation is called a "Dirty Read".

If you need to ensure that a client always reads the latest version of your data, then you can do the following.

## .NET Client

Use the `PerformOnMasterOnly` setting in your [connection string](docs/dotnet-api/connecting-to-a-server/index.html#creating-a-connection):

```csharp
var connectionString = "ConnectTo=tcp://admin:changeit@localhost:1113; PerformOnMasterOnly=True"
```

## HTTP Client

If your client doesn't provide this method, use the [`ES-RequireMaster` HTTP header](docs/http-api/optional-http-headers/requires-master/index.html) via your client:

```shell
curl -i "http://127.0.0.1:32004/streams/newstream" -H "ES-RequireMaster: True"
```

The syntax varies from client to client but look for a parameter or method that matches and for instructions on how to use it.

## Configuration Counts

In conclusion, the possibility of a Dirty Read depends on your connection settings and if the cluster can read from any node, or read-only from master. Make sure your settings are optimised to avoid them.
