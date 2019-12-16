---
title: "Event Store 6.0.0 Preview 1"
author: "Hayley Campbell"
layout: blog-post
---

We are excited to announce the first preview release of Event Store 6.0.0!  
With this release we want to show you where we are planning on taking Event Store in the future.

This release is not intended to be used in production and is still rough around the edges, however we want to provide you with a release candidate, and we welcome your feedback.

If you encounter any issues, please don’t hesitate to [open an issue](https://github.com/EventStore/EventStore/issues/new) on GitHub if there isn’t one already.

You can download the packages from the [downloads page](https://eventstore.org/downloads/) under the Pre-Release section.

## Important!

With the preview release of Event Store, Event Store will only expose the external HTTP interface over HTTPS.

This requires a TLS certificate, but for ease of use we have introduced a development mode which uses a self signed certificate intended for development use only. Development mode can be enabled by specifying the `--dev` option when starting Event Store.

## What’s new in Event Store

There are a number of exciting features included in this preview:
- The move to .NET Core 3.1
- A gRPC client
- Server Side Filtering
- Read-Only Replicas
- Master Resignation
- Restarting the Projection Subsystem
- Pinned by Correlation Id strategy for Competing Consumers

We are working on the documenting the new features fully for the release.  
For the preview, a we have included an overview and brief guide to each feature in this post

Additionally, you can reach out to us on [github](https://github.com/EventStore/EventStore) to ask questions or report any issues.

### .NET Core 3.1

Event Store 6 only runs on Core CLR 3.1.  
Support for both .NET Framework and Mono have been dropped.  
This is one of the most requested changes we have ever had and we are pleased to be starting the process of finally delivering it with this release.

Much of the platform-specific code has been removed, and we benefit from the focus on performance that Microsoft has given the Core CLR. We now use the Kestrel HTTP server, which has significant benefits over HttpListener which was used up to version 5.

Historically we have provided Linux and macOS binaries with the Mono runtime statically linked into them. Unfortunately this is not yet supported by .NET Core. Consequently we now ship the correct version of the runtime as part of our packages.

## gRPC Client API

Since version 1.0 of Event Store, two client protocols have been supported - Atompub over HTTP, and full-duplex protocol-buffers-over-TCP.

Each of these has advantages - the Protocol Buffers API is better for latency-sensitive workloads, while the Atom API gives more flexibility for cache design. However, both require a lot of work on each platform to implement.

To improve this situation, we have added a new default client protocol in Event Store 6, using gRPC - a widely adopted standard which is interoperable across lots of platforms with minimal effort.

In Preview 1 of Event Store 6, we are shipping a .NET SDK for the new gRPC protocol. With the final version of Event Store 6, we will also ship first party, commercially supported client SDKs for Java, Node.js and Go in addition to .NET.

The Event Store .NET gRPC SDK is available on [NuGet](https://www.nuget.org/packages/EventStore.Grpc.Client/).

The following code snippets show how to perform some common operations with the .NET SDK:

### Create the Client

```cpp
var eventStoreClient = new EventStore.Grpc.EventStoreGrpcClient(new Uri("https://localhost:2113/"));
```

**Note:**  
In order for the gRPC client to connect successfully, the TLS certificate used by Event Store must be trusted by your machine.  
When running in development mode, this would be the development certificates found in `dev-ca` in the extracted directory.

Alternatively, you can disable the validation checks by specifying a custom HttpClient when creating the client, for example:

```cpp
var eventStoreClient = new EventStore.Grpc.EventStoreGrpcClient(new Uri("https://localhost:2113/"),
    () => new HttpClient(new SocketsHttpHandler
    {
        SslOptions = new SslClientAuthenticationOptions
        {
            RemoteCertificateValidationCallback = delegate { return true; }
        }
    }));
```

### Writing to a Stream with Expected Version Any

```cpp
var eventData = new EventData(Uuid.NewUuid(), "type", System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(new SomeEvent()));
await eventStoreClient.AppendToStreamAsync(
  "stream", AnyStreamRevision.Any, new[] { eventData }, cancellationToken: cancellationToken);
```

### Writing to a Stream with Expected Version

```c#
var eventData = new EventData(Uuid.NewUuid(), "type", System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(new SomeEvent()));
await eventStoreClient.AppendToStreamAsync(
  "stream", new StreamRevision(5), new[] { eventData }, cancellationToken: cancellationToken);
```

### Reading a Stream

```c#
var events = eventStoreClient.ReadStreamForwardsAsync(
  streamName, StreamRevision.Start, int.MaxValue, cancellationToken: cancellationToken);
```

### Subscribe to All

```c#
using var subscription = eventStoreClient.SubscribeToAll(
  async (s, e, ct) => { await …; }, userCredentials: new UserCredentials(“admin”, “changeit”));
```

### Subscribe to a Stream

```c#
using var subscription = eventStoreClient.SubscribeToStream(
  streamName, async (s, e, ct) => await ...);
```

## Server Side Filtering

We have also added the ability to filter both reads and subscriptions on the server-side. You can filter by either event type or stream name.

The intention here is to remove the need for having to setup and use projections when you only want to subscribe to a stream containing specific events.

New methods and overloads have been added to the .NET client API for reads and subscriptions.  
New HTTP endpoints have been added as well for reading only.

The API differs depending on whether you use the TCP or gRPC client. Below are some examples to help you get started.

### TCP Client

The server side filter is created using the new Filter class and you can choose to match either the event type or stream name against a prefix or regular expression.

```c#
var filter = Filter.EventType.Prefix("SimpleEvent");
```

That filter can then be used when making calls to either `FilteredReadAllEventsForwardAsync` or `FilteredReadAllEventsBackwardAsync` on the connection.

```c#
var readEvents = await connection.ReadAllEventsForwardFilteredAsync(
    position: Position.Start, 
    maxCount: 4096, 
    resolveLinkTos: false,
    eventFilter: eventFilter,
    maxSearchWindow: 1000);
```

There is also an additional overload where you can provide a max search window argument.  
This specifies the maximum number of events the server will search through before returning the slice.  
If no events are found within the window, an empty slice will be returned.

When it comes to subscribing the client behaves in a similar manner allowing you provide a filter.

However there is an additional overload where you can provide a checkpoint delegate as well as a checkpoint interval, for how often it should be called.  
This is to overcome the scenario where the server might search through a large number of events before it finds one that matches your filter, and you don’t want to revert all the way back should the subscription fail.

The checkpoint delegate allows you to save a checkpoint periodically to avoid this.

```c#
await connection.FilteredSubscribeToAllAsync(
   true,
   filter,
   (s, e) =>
   {
       OutputEvent(e);
       return Task.CompletedTask;
   },
   (s, p) =>
   {
       OutputCheckpoint(p);
       return Task.CompletedTask;
   },
   checkpointInterval);
```

### gRPC Client

The server side filter is created using the new `EventTypeFilter` or `StreamFilter` class and you can choose to match either against a prefix or regular expression.

For example:

```c#
var filter = new EventTypeFilter(new PrefixFilterExpression("SimpleEvent"));
var readEvents = await client.ReadAllForwardsAsync(
  position: Position.Start,
  maxCount: 4096,
  resolveLinkTos: false,
  filter: filter,
  userCredentials: new UserCredentials("admin", "changeit")).ToArrayAsync();
```

When it comes to subscribing the client behaves in a similar manner allowing you provide a filter.

For example:

```c#
var filter = new EventTypeFilter(new PrefixFilterExpression("SimpleEvent"));
client.SubscribeToAll(
  eventAppeared: (sub, e, t) => Task.CompletedTask,
  resolveLinkTos: true,
  filter: filter,
  userCredentials: new UserCredentials("admin", "changeit"));
```

Please note that for the preview the checkpoint reached callback is not yet present in the gRPC .NET Client, the work can be tracked [here](https://github.com/EventStore/EventStore/pull/2145).

### HTTP API

New endpoints have been added to allow filtered reads of $all over HTTP.

These endpoints make use of a filter query string, and look like the following:

```
https://localhost:2113/streams/$all/filtered?context={eventtype|streamid}&type={regex|prefix}&data={comma-delimited filters}

https://localhost:2113/streams/streams/$all/filtered/{position}/backward/{count}?context={eventtype|streamid}&type={regex|prefix}&data={comma-delimited filters}

https://localhost:2113/streams/streams/$all/filtered/{position}/forward/{count}?context={eventtype|streamid}&type={regex|prefix}&data={comma-delimited filters}
```

To exclude system events, add the `exclude-system-events` query option:

```
https://localhost:2113/streams/streams/$all/filtered?context={eventtype|streamid}&type={regex|prefix}&data={comma-delimited filters}&exclude-system-events
```

The previous example would look like this:

```
https://localhost:2113/streams/streams/$all/filtered/0/forward/4095?context=eventtype&type=prefix&data=SimpleEvent
```

## Read-Only Replica

A common use case for adding more nodes to a cluster is being able to provide data from Event Store closer to the destination where it’s intended to be used. However, by adding more nodes to the cluster, you incur write latency as Event Store requires a majority of the nodes in the cluster to acknowledge the write before it’s deemed successful.

Previously Event Store supported adding additional nodes to the cluster as clones for scaling out reads.  
This has led to a few issues as clones can be promoted into the cluster which can mean that clients end up reading from a node that starts participating in normal quorum operations. This has 2 undesired side effects, in that additional load can be inadvertently placed on a quorum node, and in the event of network segregation the cluster can end up in a split brain situation.

To address both of these concerns, we have introduced the ability to mark a node as a read-only replica which avoids these scenarios. This type of node will not partake in elections, and will not be promotable to a clone, slave or master node.

To start a node as a read-only replica, the `ReadOnlyReplica` option has been introduced.

```bash
%> EventStore.ClusterNode.exe --read-only-replica
```

The Event Store Client has also been adjusted to allow the user to set the node preference to ReadOnlyReplica.

```c#
var settings = EventStore.ClientAPI.ConnectionSettings.Create()
.PerformOnAnyNode()
.PreferReadOnlyReplica();
```

In the above example, you will notice that we also specify `PerformOnAnyNode`.  
This is required as by default operations want to be performed on the master node only, so if this option is not set, the client will reconnect to the master node even if `PreferReadOnlyReplica` is specified.

Once a node is connected to a ReadOnlyReplica node with the `PreferReadOnlyReplica` option set, a client will not reconnect to any other type of node.

While adding clones has not yet been deprecated, it will be in a future release.

## Resigning Master

Performing maintenance work such as scavenging on a node can result in performance degradation.  
For example, scavenging is an I/O intensive operation, and running a scavenge on a master node can affect the node's ability to serve write requests.

Providing the ability to resign the master node gives customers the ability to perform maintenance work on a node without having to shutdown or remove the node from the cluster.

Resigning the master node is currently a two-step process which leverages a previously available startup time feature called node priority. Two new admin HTTP endpoints have been added, `priority` to allow setting the node priority and `resign` to allow resigning the node.

To resign a master node, the user has to issue two HTTP POST requests.

The first action is to reduce the current master node’s priority so that during elections, another node with a higher priority will be chosen over the current master node.

```bash
%> curl -X POST -d {} https://localhost:2113/admin/node/priority/-1 -u admin:changeit
```

The second action is to issue a resignation command which will explicitly start a round of elections by which another master will be chosen.

```bash
%> curl -X POST -d {} https://localhost:2113/admin/node/resign -u admin:changeit
```

The above commands are privileged commands and require either a user in the $ops or $admins group to perform.

## Restarting the Projection Subsystem

There are a few situations where the projection subsystem can get stuck and can often only be recovered by restarting the master node.  Restarting a node is not ideal as this interrupts read and write operations, and the node may take a while to start up again.

A new operation which allows you to just restart the projection subsystem has been added. This will stop and start the subsystem as if the node had been shut down, but without interrupting any other operations on the node. During the restart, the projections may enter a “suspended” state as they dispose of their subscriptions.

To restart the projection subsystem, a user has to issue an HTTP POST request to the new endpoint.

```bash
%> curl -X POST -d {} https://localhost:2113/projections/restart -u admin:changeit
```

This command is a privileged command and requires a user in the $admins group to perform it.

## New Competing Consumer Strategy - Pinned by correlation id

A new competing consumer strategy has been added to persistent subscriptions, which presents events to the same consumer if they have the same correlation id.

In order to use this new strategy, the `$by_correlation_id` projection must be running, and you can now select this new strategy when creating the subscription through the UI or TCP client.
Thanks to @sammosampson for this feature!

## Competing Consumers - View Parked Messages

It is now possible to view the parked messages stream for a persistent subscription through the UI.

You can view this by clicking the new “View Parked Messages” button in the persistent subscription’s details.
Thanks to @StuartFergusonVme for this feature!

## Development Mode

To make things easier when running Event Store for the first time, we have introduced a development mode.

You can set this by starting up Event Store with the dev flag, e.g:

```bash
%> EventStore.ClusterNode.exe --dev
```

This configures Event Store to:

1. Use an existing development certificate.
This means that when running in development mode, you don't need to specify a certificate at startup.

2. Run in memory.
By default, development mode will not write any data to disk. You can change this behaviour by overriding the MemDb setting.

# Breaking Changes

There are a few breaking changes that need to be considered when previewing this version.  
At the moment, rolling upgrades have not been tested.

## External HTTP now uses HTTPS

The external HTTP interface has been changed to use HTTPS only.  
This means that a TLS certificate must be provided at startup to secure the interface.

This can be done either by providing the `CertificateFile` option:

```
CertificateFile: /path/to/cert.pfx
```

Or providing the certificate details if the certificate is in the windows store:

```
CertificateStoreLocation: CurrentUser
CertificateStoreName: My
CertificateThumbPrint: {Thumbprint}
CertificateSubjectName: CN={SubjectName}
```

You can also run Event Store with the `--dev` flag, discussed previously.

When considering this breaking change, please be aware that any scripts or clients making use of the HTTP interface, or using ATOM will need to be updated to use HTTPS.

## External gossip is now over HTTPS

This may affect any cluster health status monitoring you have in place, as well as TCP Clients connecting to the cluster.

The TCP client has been updated in this version to gossip over HTTPS by default. If you are using an older client, you will need to manually change it to use HTTPS when gossiping.

## TCP connections using TLS

The TCP interface and HTTPS interface are secured with the same certificate

If you use TLS on the TCP interface, you will need to use the same certificate for the HTTPS interface.

## Mono is no longer required

Given our move dotnet core, mono is no longer required on linux systems.

## HTTP Prefixes removed

HTTP prefixes were dropped with the move from HTTPListener to Kestrel.
Please be aware that Event Store will fail if you try to specify HTTP Prefixes in the configuration.

# Providing Feedback
Please provide feedback by opening issues on Github.
