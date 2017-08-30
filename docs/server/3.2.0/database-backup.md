---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Database Backup"
section: "Server"
version: "3.2.0"
---

Backing up an Event Store database is straightforward, however it is relient on having the steps below carried out in the correct order. 

## Backing up a database

1. Copy all `*.chk` files to the backup location.
2. Copy the remaining files and directories to the backup location.

## Restoring a database

1. Create a copy of `chaser.chk` and call it `truncate.chk`.
2. Copy all files to the desired location.

<span class="note">
Many people do not rely on hot backups in a highly available cluster but instead increase their node counts to retain further copies of data.
</span>

## Differential backup

Most data is stored in *chunk files*, named `chunkX.Y`, where X is the chunk number, and Y is the version of that chunk file. As the Event Store scavenges, it creates new versions of scavenged chunks which are interchangeable with older versions (but for the removed data). 

Consequently, it is only necessary to keep the file whose name has the highest `Y` for each `X`, as well as the checkpoint files and the index directory (to avoid expensive index rebuilding).

## Other Options

There are many other options available for backing up an Event Store database. For example it is possible to set up a durable subscription that would write all of the events to another storage mechanism such as a key/value or column store. These methods would require a manual set up for restoring back to a cluster group.

This option can be expanded upon to use a second Event Store node/cluster as a back up. This is commonly known as a primary/secondary back up scheme. The primary cluster runs and asynchronously pushes data to a second cluster as described above. The second cluster/node is available in the case of disaster on the primary cluster. If you are using this strategy then it is recommended to only support manual failover from Primary to Secondary as automated strategies risk causing a [split brain](http://en.wikipedia.org/wiki/Split-brain_%28computing%29) problem.
