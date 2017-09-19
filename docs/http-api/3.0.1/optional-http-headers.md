---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Optional HTTP Headers"
section: "HTTP API"
version: 3.0.1
---

The Event Store supports the use of a few custom HTTP headers for requests. 

Note that the headers have previously been in the form `X-ES-ExpectedVersion` but have been changed to `ES-ExpectedVersion` in compliance with [RFC-6648](http://tools.ietf.org/html/rfc6648).

The headers that are currently supported are:

| Header                                   | Description                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [ES-ExpectedVersion](./expected-version) | The expected version of the stream (allows optimistic concurrency)                                 |
| [ES-ResolveLinkTo](./resolve-linkto)     | Whether or not to resolve linkTos in stream                                                        |
| [ES-RequiresMaster](./requires-master)   | Whether this operation needs to be run on the master node                                          |
| [ES-TrustedAuth](./trusted-intermediary) | Allows a trusted intermediary to handle authentication                                             |
| [ES-LongPoll](./longpoll)                | Instructs the server to do a long poll operation on a stream read                                  |
| [ES-HardDelete](./harddelete)            | Instructs the server to hard delete the stream when deleting as opposed to the default soft delete |
| [ES-EventType](./eventtype)              | Instructs the server the event type associated to a posted body                                    |
| [ES-EventId](./eventid)                  | Instructs the server the event id associated to a posted body                                      |