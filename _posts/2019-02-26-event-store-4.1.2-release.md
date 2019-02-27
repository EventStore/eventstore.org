---
title: "Event Store 4.1.2"
author: "Shaan Nobee"
layout: blog-post
---

Event Store 4.1.2 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

Following the release of [v5 last week](https://eventstore.org/blog/20190218/event-store-5.0.0-release/), we have now released a minor update to v4 which contains important bug fixes backported from v5.

If you're not yet ready to jump to v5, this release is for you. However, we strongly recommend to upgrade to v5 as soon as possible for more stability (for instance to benefit from the mono and v8 upgrades) and the latest features.

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/).

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=4.1.2-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 4.1.2
```

**Client Packages**  

No client packages have been released.

## Event Store 4.1.2 Changelog

### Bug Fixes
* [#1640](https://github.com/EventStore/EventStore/pull/1640) - **(Server)** Fix latency issue in index committer service queue & off by one error when shutting down EventStore services
* [#1644](https://github.com/EventStore/EventStore/pull/1644) - **(Server)** Fix bug in `MakeUrl()` where url is wrongly formed when query parameters are present. This would cause the UI to throw an error when opening the `Query` tab.
* [#1653](https://github.com/EventStore/EventStore/pull/1653) - **(Server)** Fix bug in TFChunkDB causing pre-last chunk file not to be verified
* [#1667](https://github.com/EventStore/EventStore/pull/1667) - **(Server)** Fix issue where promoting a user to administrator required a server restart before taking effect
* [#1712](https://github.com/EventStore/EventStore/pull/1712) - **(Server)** Added max count to `$PersistentSubscriptionConfig` to limit the size of the stream. The stream size was previously unbounded.
* [#1737](https://github.com/EventStore/EventStore/pull/1737) - **(Server)** Fixed `ObjectPoolMaxLimitReachedException` for many reader threads (thanks to [@MadKat13](https://github.com/MadKat13)!)  
When `--reader-threads-count` is increased, the object pool size was not scaled up accordingly. The following error would be thrown during high read load:
`Object pool 'ReadIndex readers pool' has reached its max limit for items: 14.`
* [#1742](https://github.com/EventStore/EventStore/pull/1742) - **(Server)** Dispose chunk before attempting deletion if an error occurs during scavenging
* [#1828](https://github.com/EventStore/EventStore/pull/1828) - **(Server)** Check to avoid crash when network is disconnected.
* [#1829](https://github.com/EventStore/EventStore/pull/1829) - **(Server)** Do not publish `StorageMessage.EventCommitted` messages when rebuilding the index. This speeds up full index rebuilds by a factor of approximately 1.8x and also speeds up node startup time by a few seconds when there are many index entries to rebuild.
* [#1841](https://github.com/EventStore/EventStore/pull/1841) - **(Server)** Fix drive stats for ZFS filesystems (total/free space). (thanks to [@ahjohannessen](https://github.com/ahjohannessen)!)  
The following error would previously be visible in the logs:
```
Error while reading drive info for path "/path/to/db". Message: "The drive name does not exist
Parameter name: driveName".
```
* [95afc8](https://github.com/EventStore/EventStore/commits/95afc86b057125ff1c79d0a01b91168841c0f0e5) - **(Server)** Fix projection control bug: Premature reply was being sent when projection stopped, faulted & deleted.

## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).
