---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "HTTP API: Optional HTTP Headers"
section: "HTTP API"
version: "3.8.1"
exclude_from_sidebar: true
---

The Event Store supports the use of a few custom HTTP headers for requests. 

<span class="note">
That the headers have previously been in the form `X-ES-ExpectedVersion` but have been changed to `ES-ExpectedVersion` in compliance with RFC-6648 http://tools.ietf.org/html/rfc6648.
</span>

The headers that are currently supported are:

- [ES-ExpectedVersion](HTTP-Expected-Version-Header) The expected version of the stream (allows optimistic concurrency)
- [ES-ResolveLinkTo](HTTP-Resolve-LinkTo-Header) Whether or not to resolve linkTos in stream
- [ES-RequiresMaster](HTTP-Requires-Master-Header) Whether this operation needs to be run on the master node
- [ES-TrustedAuth](HTTP-Trusted-Intermediary-Header) Allows a trusted intermediary to handle authentication
- [ES-LongPoll](Http-LongPoll-Header) Instructs the server to do a long poll operation on a stream read
- [ES-HardDelete](Http-HardDelete) Instructs the server to hard delete the stream when deleting as opposed to the default soft delete
- [ES-EventType](HTTP-EventType-Header) Instructs the server the event type associated to a posted body
- [ES-EventId](HTTP-EventId-Header) Instructs the server the event id associated to a posted body
![Google analytics pixel](https://gaproxy-1.apphb.com/UA-40176181-1/Wiki/Optional-Http-Headers)