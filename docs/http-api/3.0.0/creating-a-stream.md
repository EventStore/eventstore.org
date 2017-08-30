---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Creating a Stream"
section: "HTTP API"
version: 3.0.0
---

<span class="note">
As of Event Store 2.0.0, there is no explicit stream creation operation, as there is no longer a `$StreamCreated` as the first event in every stream.
</span>

To set stream metadata (for example, an access control list or a maximum age or count of events), use the operations described in [Stream Metadata](../stream-metadata), and then post to the stream using the operations described in [Writing to a Stream)](../writing-to-a-stream).
