---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Rebuilding Indexes"
section: "Server"
version: "4.0.0"
---

As of version 3.9.0 all future indexes will use 64-bit hashes instead of 32-bit hashes. The system will automatically transisition from 32-bit to 64-bit by writing all new indexes as 64-bit indexes during the merge process.

If you prefer to use only 64-bit indexes immediately you can force this.

For a small db just delete the index folder and let it rebuild (might
take a while)

If you have a large db / remote storage / etc and cannot take the time
you can also do this operation offline on another node:

1. Take back up.
2. Restore to fast local disks.
3. Delete index folder from back up.
4. Run event store with cluster size 3 to prevent other writes. It will rebuild index.
5. Restore the index back to a node (index folder).
6. Let it catch up from master.
7. Repeat restore for other nodes.

For others the index will eventually be 64 bit due to the merging
process that occurs over time.
