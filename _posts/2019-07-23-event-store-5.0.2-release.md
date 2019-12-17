---
title: "Event Store 5.0.2"
author: "Shaan Nobee"
layout: blog-post
category: 'Release Notes'
---
Event Store 5.0.2 is out! It is available for the following operating systems:

- Windows
- Ubuntu 18.04
- Ubuntu 16.04
- Ubuntu 14.04 (EOL reached)
- macOS 10.9+
- CentOS 7 (Commercial version)
- Amazon Linux AMI (Commercial version)

This release comes with some important bug fixes and we highly recommend our users to upgrade as soon as possible. We're also planning to roll out version 4.1.4 with some of these bug fixes within the next few days.

Please note that Ubuntu 14.04 (Trusty Tahr) has reached its end-of-life and thus we will stop releasing packages for it as from the next version.

## Where can I get the packages?

Downloads are available on our [website](https://eventstore.org/downloads/).

The packages can be installed using the following instructions.

**Ubuntu 14.04/16.04/18.04** (via [packagecloud](https://packagecloud.io/EventStore/EventStore-OSS))

```
curl -s https://packagecloud.io/install/repositories/EventStore/EventStore-OSS/script.deb.sh | sudo bash
sudo apt-get install eventstore-oss=5.0.2-1
```

**Windows** (via [Chocolatey](https://chocolatey.org/packages/eventstore-oss/))

```
choco install eventstore-oss -version 5.0.2
```

**Client Packages**  
[EventStore Client](https://www.nuget.org/packages/EventStore.Client/)  
```
dotnet add package EventStore.Client --version 5.0.2
```

[EventStore Embedded Client](https://www.nuget.org/packages/EventStore.Client.Embedded/)  
```
dotnet add package EventStore.Client.Embedded --version 5.0.2
```

## Upgrade Procedure
To upgrade a cluster, a usual rolling upgrade can be done:
- Pick a node (Start with slave nodes first, then choose the master last)
- Stop the node, upgrade it and start it

## Breaking changes
## HTTP Authorization
An authorization layer has been added to the HTTP API. The entire HTTP API surface has been reviewed specifying the minimum authorization level required to access a particular endpoint. 

After these changes, the different user roles can be summarized as follows:
- Users in the `$ops` group can now do everything that a user in the `$admins` group can do except user management and reading from system streams.
- Users who are not part of any groups can browse non-system streams, view projection/persistent subscription stats, execute transient queries, change their own password and do everything that an unauthenticated user can do.
- Unauthenticated users can now only access the following endpoints: `/stats`, `/stats/*`, `/info`, `/ping`, `/gossip`,`/elections/*`

There are two types of breaking changes:
- Endpoints that were previously accessible by a particular type of user are now no longer accessible (returning `401 - Unauthorized`)
- Endpoints that were previously not accessible (returning `401 - Unauthorized`) by a particular type of user but are now accessible.

If you are affected by the breaking changes and would like to see the legacy behaviour, we have added a config option called `DisableFirstLevelHttpAuthorization` that can be set to `True` to disable this layer of authorization.

### Previously accessible endpoints but now `401 - Unauthorized`
- Most endpoints falling under this category affect unauthenticated users. Previously, many operations on non-system streams or subscriptions were allowed over the HTTP API without requiring authentication but these permissions have now been enforced.

### Previously `401 - Unauthorized` but now accessible endpoints
- All of the endpoints falling under this category affect users in the `$ops` group. The changes revolve mainly around allowing users in the `$ops` group to manage persistent subscriptions and projections.

## LimitNOFILE=32768
On Centos 7, Ubuntu 16.04 and 18.04, `LimitNOFILE` has been added to the systemd service file with a default value of `32768`. This parameter controls the maximum number of file descriptors (including sockets!) open by the `eventstored` process. For small and medium-sized databases, `32768` is a reasonable value but the value needs to be increased for large databases with several thousand chunk files or many client connections.

### Increasing LimitNOFILE
To increase the value to `65536` for example, we recommend adding a systemd unit file override by following these steps. These settings will survive Event Store upgrades.
```
$ sudo systemctl edit eventstore.service
```

Add the following lines and save:
```
[Service]
LimitNOFILE=65536
```

Reload systemctl daemon and restart the eventstore service:
```
sudo systemctl daemon-reload
sudo systemctl restart eventstore.service
```

## Event Store 5.0.2 Changelog

### Commercial-only changes
* Several stability improvements have been brought to the LDAP plugin:  
The authentication logic has been rewritten for Windows using `System.DirectoryServices.Protocols` which eliminates the dependency on `Mono.Security` on Windows. On Linux, we now use mono's in-built `Novell.Directory.Ldap` library which is more stable.

### Important Bug Fixes
* [#1930](https://github.com/EventStore/EventStore/pull/1930) - **(Core Database)** Fix UnbufferedFileStream.SetLength() bug  
This is a critical bug that affects versions 4.1.0 to 5.0.1. It applies only if running EventStore with the `Unbuffered` configuration option set to `True`. This option is set to `False` by default. The following fatal error will be thrown when completing a chunk file and most of the data in the chunk file being completed will be lost:
```
EXCEPTION OCCURRED
System.NotSupportedException: Unable to expand length of this stream beyond its capacity.
   at System.IO.UnmanagedMemoryStream.Write(Byte[] buffer, Int32 offset, Int32 count)
   at EventStore.Core.TransactionLog.Chunks.TFChunk.TFChunk.WriteRawData(WriterWorkItem workItem, Byte[] buf, Int32 len) in TFChunk.cs
```
* [#1936](https://github.com/EventStore/EventStore/pull/1936) - **(Client)** Client subscription partition tolerance  
This fix improves the stability of catch-up subscriptions during reconnections
* [#1962](https://github.com/EventStore/EventStore/pull/1962) - **(HTTP API)** Add an authorization layer to all HTTP endpoints  
[#223](https://github.com/EventStore/EventStore.UI/pull/223) - **(Web UI)** HTTP Authorization UI changes  
An authorization layer has been added to the HTTP API. The entire HTTP API surface has been reviewed specifying the minimum authorization level required to access a particular endpoint. The roles of the different types of users have been reviewed as well:
  - Users in the `$ops` group can now do everything that a user in the `$admins` group can do except user management and reading from system streams.
  - Users who are not part of any groups can browse non-system streams, view projection/persistent subscription stats, execute transient queries and change their own password.
  - Unauthenticated users can now only access the following endpoints: `/stats`, `/stats/*`, `/info`, `/ping`, `/gossip`,`/elections/*`

### Miscellaneous
* [#222](https://github.com/EventStore/EventStore.UI/pull/222) - **(Web UI)** User Details page revamped (thanks to [shubham3597](https://github.com/shubham3597) for this contribution!)
* [#1932](https://github.com/EventStore/EventStore/pull/1932) - **(Web UI)** Prevent browser from invoking Basic Auth login dialog on Chrome
* [#1933](https://github.com/EventStore/EventStore/pull/1933) - **(Client)** Enable logging of errors when attempting to discover nodes via DNS or gossip seeds
* [#1937](https://github.com/EventStore/EventStore/pull/1937) - **(Client)** Refactoring: DRY ClusterDnsEndPointDiscoverer creation (thanks to [@bartelink](https://github.com/bartelink) for this contribution!)
* **Packaging** Set `LimitNOFILE` to a default reasonably high value for all distributions running with systemd


## How do I provide feedback?

We appreciate any feedback via either [GitHub Issues](https://github.com/EventStore/EventStore) or [Google Groups](https://groups.google.com/forum/#!forum/event-store).