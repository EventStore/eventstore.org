---
title: "Event Store 3.9.0 Released"
author: "Pieter Germishuys"
layout: blog-post
---

Event Store 3.9.0 is now released! This release contains a number of improvements and bug fixes. The main feature around this release was the introduction of 64bit indexes.

To explain a little more, Event Store has a single index (made up of an in memory index and zero or more index files stored on disk called PTables). Each index entry used to be made up of a hash of the stream id (uint32), version (uint32) and the log position (ulong).

When a user attempts to read a stream, the indexes are queried using a hash of the stream id. This may result in a record being returned but for the wrong stream ID as a hash collision can occur, meaning that different stream ids can have the same resulting hash being computed.

We have with version 3.9.0 expanded the range of the stream hashes from 32bits to 64bits thus reducing the possibility of hash collisions.

All the new persisted indexes will be in the new 64bit format and any indexes that are merged together will result in the 32bit indexes being upgraded to 64bit indexes. We opted not to include a new option to force 64bit indexes but rather an automatic conversion over to 64bit indexes. If you wish to have all your indexes as 64bit indexes, you can just delete your existing indexes and your indexes will be rebuilt as 64bit indexes.

## Event Store Server 3.9.0 release notes

- [#1021](https://github.com/EventStore/EventStore/pull/1021) **(All Platforms)** Introducing 64bit indexes. This reduces the possibility of stream hash collision occurring.
- [#993](https://github.com/EventStore/EventStore/pull/993) **(All Platforms)** (Projections) When failing to initialize a projection, surface the error to the user.
- [#995](https://github.com/EventStore/EventStore/pull/995) **(All Platforms)** (Projections) Remove the option to force a projection name.
- [#997](https://github.com/EventStore/EventStore/pull/997) **(All Platforms)** Add `ReaderThreadCount` command line option.
- [#996](https://github.com/EventStore/EventStore/pull/996) **(All Platforms)** (Projections) Allow the user to delete a faulted projection.
- [#1003](https://github.com/EventStore/EventStore/pull/1003) **(All Platforms)** Make midpoints and validate at same time to speed up loading the readIndex.
- [#1005](https://github.com/EventStore/EventStore/pull/1005) **(All Platforms)** (Projections) Fail on reading a null checkpoint tag for an emitted stream.
- [#1008](https://github.com/EventStore/EventStore/pull/1008) **(All Platforms)** Calculate the appropriate index cache depth automatically.
- [#999](https://github.com/EventStore/EventStore/pull/999) **(All Platforms)** (Projections) Fault the projection on checkpoint write fail.
- [#1009](https://github.com/EventStore/EventStore/pull/1009) **(All Platforms)** Fix Transfer-Encoding:Chunked requests failing on slaves.
- [#1023](https://github.com/EventStore/EventStore/pull/1023) **(All Platforms)** Continue scavenge if an exception is thrown while scavenging a chunk.

## .NET Client 3.9.0 release notes

- [#987](https://github.com/EventStore/EventStore/pull/987) **(All Platforms)** Added an option to create a `StreamMetadataBuilder` from existing metadata.
- [#989](https://github.com/EventStore/EventStore/pull/989) **(All Platforms)** Add track and delete emitted streams options to `ProjectionsManager`.
- [#998](https://github.com/EventStore/EventStore/pull/998) **(All Platforms)** Deny persistent subscription operations being performed on a slave.

## Event Store UI 3.9.0 release notes

- [#135](https://github.com/EventStore/EventStore.UI/pull/135) Display the reason when there is an error creating a competing consumer.
- [#134](https://github.com/EventStore/EventStore.UI/pull/134) Show errors thrown when a chunk has been scavenged.