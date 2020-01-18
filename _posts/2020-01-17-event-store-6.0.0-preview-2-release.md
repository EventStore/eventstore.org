---
title: "Event Store 6.0.0 Preview 2"
author: "Mat McLoughlin"
layout: blog-post
category: "Release Notes"
---

We are excited to announce the second preview release of Event Store 6.0.0.

This release addresses some of the feedback from the first preview.

This release is not intended to be used in production and is still rough around the edges, but we welcome your feedback as we prepare a release candidate.

If you encounter any issues, please don’t hesitate to open an issue on [GitHub](https://github.com/eventstore/eventstore) if there isn’t one already.

You can download the packages from the downloads page under the Pre-Release section.

If you are running on macOS, you need to run Event Store in Docker, since currently servers using .NET Core’s gRPC implementation require the platform to support server ALPN, which macOS did not until Catalina. As soon as this restriction is lifted by the .NET Core platform, Event Store will release packages for macOS.

## New Event Store operations gRPC client

With the release of preview two of Event Store, we are also shipping a new [gRPC based operations client](https://www.nuget.org/packages/EventStore.Client.Operations.Grpc/6.0.0-preview2) which as it currently stands has support for scavenging.

## .NET gRPC client rename

We have renamed the .NET gRPC Client to **EventStore.Client.Grpc**. In preview one, it was named **EventStore.Grpc.Client**.

The package is available [on NuGet](https://www.nuget.org/packages/EventStore.Client.Grpc/). The [NuGet package](https://www.nuget.org/packages/EventStore.Grpc.Client/6.0.0-preview1) from preview one will not receive updates and is deprecated.

## Simplification of .NET gRPC client methods

To simplify the gRPC API, we have exposed the read direction in the gRPC Client as a parameter.

`ReadAllForwardAsync` and `ReadAllBackwardAsync` are now collapsed into `ReadAllAsync` with the first parameter being the direction of the read to be performed.

```csharp
eventStoreClient.ReadAllAsync(
    direction: Direction.Forwards,
    position: Position.Start,
    maxCount: 4096,
    resolveLinkTos: true,
    filter: null,
    userCredentials: new EventStore.Client.UserCredentials("admin", "changeit"));
```

`ReadStreamForwardAsync` and `ReadStreamBackwardAsync` are now collapsed into `ReadStreamAsync` with the first parameter being the direction of the read to be performed.

```csharp
eventStoreClient.ReadStreamAsync(
    direction: Direction.Forwards,
    streamName: "foo",
    revision: StreamRevision.Start, count: 4096,
    resolveLinkTos: true,
    userCredentials: new EventStore.Client.UserCredentials("admin", "changeit"));
```

> Note: This is a breaking change from preview one.

## Replication improvements

Improvements have been made to centralize replication logic for each type of operation. This improves performance and correctness.

## Liveness health check

We have introduced a health check which can be queried via the `{server_address}/health/live` endpoint. This endpoint will return a 204 status code once Event Store is ready, and is now configured as the default health check in the Docker container.

## Persistent subscription statistics

We have included the retry count for persistent subscription’s HTTP based API.

## HTTP request neutrality

We have addressed an issue where particular fields (notably `$type`) being present in the payload of a client operation would cause a re-serialization during response, dropping the field.

## Projection write improvements

When experiencing commit timeouts, projections would attempt to write five times with a few seconds between each retry before they are marked as faulted. After this, manual intervention was required to re-enable the projections.

To alleviate the effects of commit timeouts during writes from projections, a system of exponential backoff with jitter has been added. This should prevent projection retries from overloading the server with write retries.

The retry count for projections has also been increased, as the previous number of five retries only corresponded with about 10 seconds.

## Removal of undocumented projections selectors

In our ongoing effort to improve projections we have made a number of changes.

Some projection selectors and options were removed:

- `fromStreamCatalog` selector
- `fromStreamsMatching` selector
- `disableParallelism` option
- `catalogTransform` option

These selectors were only usable in queries or transient projections. If you were using them, you need to recreate any affected queries or transient projections.

As only `fromStreamsMatching` was officially documented, it was the only one of these officially supported.

Usage of `fromStreamsMatching` can be replaced with `fromAll` with an appropriate `where` modifier.

## Deprecation of clone nodes

Following the release of Read-Only Replicas, Clones have been disabled by default.

The new default behaviour is for nodes in excess of the configured cluster size to be terminated upon joining.

If you need to make use of Clones nodes while transitioning to using read replicas, the old behaviour can be restored by setting the `--unsafe-allow-surplus-nodes` option on all nodes in the cluster.

## Improvements to Event Store gRPC protocol buffer design

> Note: this does not affect users of Event Store, only those implementing client SDKs. If you are developing a gRPC-based client, please update your proto contracts.

We have received some great feedback from the community around gRPC, more notably community members who have started building gRPC clients for a variety of platforms, and have adjusted the protocol buffers API definitions in response to that:

- Plural options are now in singular form, which addresses code generation failures in Scala and Rust.
- Clients can now request UUIDs to be serialized either as two 64-bit unsigned integers or as strings, improving compatibility with Node.js and Go UUID libraries.

## Event counters for statistics

Windows-centric performance counters do not work with .NET Core, so many statistics are now collected using the `Microsoft.Diagnostics.NETCore.Client` package.

> Note: Currently system-wide CPU and memory usage are not exposed via the statistics endpoint on Linux or macOS. This will be rectified in the release candidate.
