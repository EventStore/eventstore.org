---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Default Directories"
section: "Server"
version: "3.7.0"
pinned: true
---

The default directories used by Event Store vary by platform in order to best fit with the expectations of users in each case.

<span class="note--warning">
Paths beginning with "." are relative to the directory in which "eventstored" or "EventStore.ClusterNode.exe" are located. Absolute paths are as written.
</span>

### Linux ###
- **Application:** `/usr/bin` (when installed via Debian package)
- **Content:** `/usr/share/eventstore`
- **Configuration:** `/etc/eventstore/`
- **Data:** `/var/lib/eventstore`
- **Application Logs:** `/var/log/eventstore`
- **Test Client Logs:** `./testclientlog` (not included in Debian package)
- **Web Content:** `./clusternode-web` *then* `{Content}/clusternode-web`
- **Projections:** `./projections` *then* `{Content}/projections`
- **Prelude:** `./Prelude` *then* `{Content}/Prelude`

### All other OSes (Includes Windows/macOS) ###
- **Content:** `./`
- **Configuration:** `./`
- **Data:** `./data`
- **Application Logs:** `./logs`
- **Test Client Log:** `./testclientlogs`
- **Web Content:** `./clusternode-web` *then* `{Content}/clusternode-web`
- **Projections:** `./projections` *then* `{Content}/projections`
- **Prelude:** `./Prelude` *then* `{Content}/Prelude`
