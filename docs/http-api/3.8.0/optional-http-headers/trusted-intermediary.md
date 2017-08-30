---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Optional HTTP Headers: Trusted Intermediary"
section: "HTTP API"
version: "3.8.0"
exclude_from_sidebar: true
---

The trusted intermediary header is related to supporting a common security architecture. There are thousands of possible methods of handling authentication in the world today and it is impossible for us to support them all. The general idea behind the header is that you can configure a trusted intermediary to handle the authentication instead of the Event Store.

A sample configuration of this might be to enable OAuth2. First configure the Event Store to run on the local loopback. Next configure nginx to handle OAuth2 authentication. After authenticating the user, nginx would rewrite the request and forward it to the loopback to the Event Store that would actually serve the request.

ES-TrustedAuth: "root; admin, other"

The header has the form of "{user}; group, group1". This information will then be used with the internal Event Store ACLs to handle security. 

It is important to note that this feature is **DISABLED** by default. You must specifically opt into this feature by running the Event Store with the Enable Trusted Intermediary command/config option.