---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Scavenging"
section: "Server"
version: "3.8.1"
---

When you delete events or streams in Event Store, they aren't removed immediately. In order for these events to be permanently deleted you will need to run a scavenge on your database.

Simply put, a scavenge reclaims disk space by rewriting your database chunks minus the events that should be deleted, and then deleting the old chunks. Once a scavenge has been run, any deleted events cannot be recovered.

<span class="note">
Scavenges only affect completed chunks, so deleted events in the current chunk will still be there after you run a scavenge.
</span>

## Starting a scavenge

Scavenges are not run automatically by Event Store. Our recommendation is that you set up a scheduled task, for example using cron or Windows Scheduler, to trigger a scavenge as often as you need.

A scavenge can be started by issuing an empty `POST` to the HTTP API with the credentials of an `admin` or `ops` user :

```bash
curl -i -d {} -X POST http://localhost:2113/admin/scavenge -u "admin:changeit"
```

Scavenges can also be started from the `Admin` page in the Admin UI.

<span class="note--warning">
Each node in a cluster has its own independant database. As such, when you run a scavenge, you will need to issue a scavenge request to each node.
</span>

## How often should scavenges be run

How often you should run a scavenge depends on the following:

- How often you delete streams
- Depending on how you set `$maxAge`, `$maxCount` or `$tb` metadata on your streams

## Scavenging while Event Store is online

It is safe to run a scavenge while Event Store is running and processing events; it is designed to be an online operation.

Keep in mind that scavenging will increase the number of reads/writes being made to your disk, and therefore it is not recommended to run it when your system is under heavy load.
