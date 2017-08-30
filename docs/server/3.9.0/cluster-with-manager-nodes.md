---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Setting up a Cluster with Manager Nodes"
section: "Server"
version: "3.9.0"
---

Event Store allows several nodes to be run as a cluster, in order to achieve high availability of the database. There are two modes in which clustering can be run:

- With database nodes only (open source and commercial)
- With manager nodes and database nodes (commercial only)

This document covers setting up Event Store with manager nodes and database nodes.

## Manager Nodes

Each physical (or virtual) machine in an Event Store cluster typically runs one manager node and one database node. It is also possible to have multiple database nodes per physical machine, running under one manager node.

Manager nodes have a number of responsibilities:

- They are responsible for starting the database nodes, and supervising them to ensure they are restarted in the case of a crash or termination owing to abnormal circumstances. This is known as the *watchdog* service.
- They communicate with other manager nodes in order to determine overall cluster state, and relay that information to the database nodes under management.
- They provide a known endpoint for clients to connect to to discover cluster information.
- When running on Windows, manager nodes run as Windows services.

## Configuring Nodes

Each database or manager node can have a variety of configuration sources. Each source has a priority, and running configuration is determined by evaluating each source and then applying the option from the source with the highest priority.

From lowest to highest priority, the sources of configuration are:

- Default settings
- Settings specified in a configuration file written using YAML
- Settings specified in environment variables
- Settings specified as command line options to the node.

The effective configuration of a node can be determined by passing the `-WhatIf` flag to the process.

## Typical Deployment Topologies

Event Store clusters follow a "shared nothing" philiosophy. This means that no shared disks are required in order for clustering to work. Instead, several database nodes store your data in order to ensure that it is not lost in the case of a drive failure or a node crashing.

A quorum-based replication model is used, in which a majority of nodes in the cluster must acknowledge that a write has been committed to disk prior to the write being acknowledged to the client. This means that in order to be able to tolerate the failure of *n* nodes, the cluster must be of size *(2n + 1)*. Consequently, a three-database-node cluster can continue to accept writes in the case that one node is unavailable, a five-database-node cluster can continue to accept writes in the case that two nodes are unavailable, and so forth. 

A typical deployment topology consists of three physical machines, each running one manager node and one database node, as shown in figure 1. Each of the physical machines may have two network interfaces - one for communicating with other cluster members, and one for serving clients. Although it may be preferable in some situations to run over two separate networks, it is also possible to use different TCP ports on one interface.

## Cluster gossip

Event Store uses a quorum-based replication model. When working normally, a cluster will have one database node which is known as a *master*, and the remaining nodes will be *slaves*. The master node is responsible for co-ordinating writes during the period it is master. Database nodes use a concensus algorithm to determine which database node should be master and which should be slaves. The decision as to which node should be master is based on a number of factors (some of which are configurable).

In order for database nodes to have this information available to them, the nodes gossip with other nodes in the cluster. Gossip runs over the internal and optionally the external HTTP interfaces of database nodes, and over both internal and external interfaces of manager nodes.

## Discovering cluster members

Manager and database nodes need to know about one another in order to gossip. To bootstrap this process, gossip seeds, or the addresses where some other nodes may be found, must be provided to each node. When running with manager nodes, the following approach is normally used:

- On each physical machine, the database node(s) are configured with a gossip seed of the internal HTTP interface of the manager running on the same physical machine.
- The managers are configured to discover other managers in one of two ways:
    - via a DNS entry and a well-known gossip port
    - via a list of other managers’ addresses

The preferred method is via a DNS entry. To set this up, a DNS entry is made for the cluster with an A record pointing to each member of the cluster. Each manager will then look up other nodes in the cluster during the startup process based on the DNS name. Since DNS only provides information about addresses, it is required for a consistent TCP port to be used across the cluster for gossip.

## Example 1 - A Three-Machine Cluster

This example will show the configuration for a three node cluster, running in the typical setup of one manager node and one database node per physical machine, with cluster discovery via DNS. Each machine has only one network interface, therefore different ports are used for the internal and external traffic. All nodes in this case are running Windows, so the manager nodes will run as Windows services. 

This setup is shown in figure 2 below. The important points for writing configuration files are:

- Node IP Addresses: 192.168.1.11, 192.168.1.12 and 192.168.13
- TCP ports: (defaults):
    - Manager Nodes:
        - Internal HTTP: 30777
        - External HTTP: 30778
    - Database Nodes:
        - Internal TCP: 1112
        - External TCP: 1113
        - Internal HTTP: 2112
        - External HTTP: 2113
- DNS Entry Name: cluster1.eventstore.local

In order to configure the cluster correctly, there are a number of steps which must be taken:

1. Set up a DNS entry named `cluster1.eventstore.local` with an A record for each node
1. Write the database node configuration file for each machine
1. Write the manager node configuration file for each machine
1. Write the watchdog configuration file for each machine
1. Deploy the Event Store software and the configuration files to each machine
1. (Windows-specific) Add HTTP URL ACL entries to allow starting HTTP servers on the required HTTP ports
1. (Windows-specific) Install the manager as a service and start the service
1. (Linux-specific) Configure the manager as a daemon

### DNS entry

How this is achieved depends on which DNS server is in use, but the eventual lookup should read:

```
$ nslookup cluster1.eventstore.local
Server:		192.168.1.2
Address:	192.168.1.2#53

Name:	cluster.eventstore.local
Address: 192.168.1.11
Name:	cluster.eventstore.local
Address: 192.168.1.12
Name:	cluster.eventstore.local
Address: 192.168.1.13
```

### Database Node Configuration

All three nodes will be similar in configuration. The important configuration points are IP Addresses for internal and external interfaces, the ports for each endpoint, the location of the database file, the size of the cluster and the endpoints from which to seed gossip (in this case the local manager). We assume in this case that Event Store data is to be stored on the `D:\` drive.

The configuration files are written in YAML, and reads as follows for the first node:

```yaml
# Filename : database.yaml
---
Db: d:\es-data
IntIp: 192.168.1.11
ExtIp: 192.168.1.11
IntTcpPort: 1112
IntHttpPort: 2112
ExtTcpPort: 1113
ExtHttpPort: 2113
DiscoverViaDns: false
GossipSeed: ['192.168.1.11:30777']
ClusterSize: 3
```

For each subsequent node, the IP Addresses change, as does the gossip seed (since it is the manager running on the same physical machine as each node).

### Manager Configuration

Again, all three nodes will be similar in configuration. The important configuration points are the IP addresses for the internal and external interfaces, the ports for the HTTP endpoints, the log location, and the DNS information about other nodes. Another important piece of configuration is which database nodes the manager is responsible for starting. This is defined in a separate file (the watchdog configuration), the path to which is specified as `WatchdogConfig` in the manager configuration.

The configuration files are written in YAML, and for the first node reads as follows:

```yaml
# Filename: manager.yaml
---
IntIp: 192.168.1.11
ExtIp: 192.168.1.11
IntHttpPort: 30777
ExtHttpPort: 30778
DiscoverViaDns: true
ClusterDns: cluster1.eventstore.local
ClusterGossipPort: 30777
EnableWatchdog: true
WatchdogConfig: c:\EventStore-Config\watchdog.esconfig
Log: d:\manager-log
```

### Watchdog Configuration

The watchdog configuration file details which database nodes the manager is responsible for starting and supervising. Unlike the other configuration files, the manager configuration uses a custom format instead of YAML. Each node for which the manager is responsible has one line in the file, which starts with a `#` symbol, and then details the command line options to be given to the database node when it is started. Under normal circumstances this will just be the path to the database node’s configuration file.

For the first node in the example cluster, the watchdog configuration file reads as follows:

```
# --config c:\EventStore-Config\database.yaml
```

### Deploying the Event Store software and configuration

Having written configuration files for each node, the software and configuration can be deployed. Although it is possible to use relative paths when writing configuration files, it is preferable to use absolute paths to reduce the potential for confusion.

In this case, the Event Store software is deployed on each node in `c:\EventStore-HA-v3.0.1\`, and the configuration files for that node are deployed into `C:\EventStore-Config\`. No installation process is necessary - the packaged distribution can simply be unzipped, assuming they have been unblocked following download.

### (Windows-Specific) Adding HTTP ACL entries for HTTP servers

In order to allow for non-elevated users to run HTTP servers on Windows, it is necessary to add entries to the access control list using `netsh`. By default, the manager node runs as `NT AUTHORITY\Local Service`, so this is the user which must have permission to run the HTTP server.

The commands used to add these entries on node 1 are as follows (note they must be run as an elevated user):

```
# Database Node Internal HTTP Interface
netsh http add urlacl url=http://192.168.1.11:2112/ user="NT AUTHORITY\LOCAL SERVICE"

# Database Node External HTTP Interface
netsh http add urlacl url=http://192.168.1.11:2113/ user="NT AUTHORITY\LOCAL SERVICE"

# Manager Node Internal HTTP Interface
netsh http add urlacl url=http://192.168.1.11:30777/ user="NT AUTHORITY\LOCAL SERVICE"

# Manager Node External HTTP Interface
netsh http add urlacl url=http://192.168.1.11:30778/ user="NT AUTHORITY\LOCAL SERVICE"
```

### (Windows-Specific) Configure the Manager Node as a service

Manager nodes can be installed as a Windows service, in order that they can be started on boot rather than running in interactive mode. Each manager service is given an instance name, which becomes the name of the service (and part of the description for easy identification). The service is installed by default with a startup type of Automatic (Delayed Start).

#### Installing the service

To install the manager node on machine 1, the following command is used:

```
C:\EventStore-HA-v3.0.1\> EventStore.WindowsManager.exe install -InstanceName es-cluster1 -ManagerConfig C:\EventStore-Config\manager.yaml
```

The service will then be visible in the services list, with a description of “Event Store Manager (es-cluster1)”.

#### Uninstalling the service

To uninstall the manager node service in future, the following command can be used (where the instance name matches the name used during installation).

```
C:\EventStore-HA-v3.0.1\> EventStore.WindowsManager.exe uninstall -InstanceName es-cluster1 
```

#### Manually starting and stopping the service

* To start the manager node use the `net start es-cluster1` command.
* To stop the manager node use the `net stop es-cluster1` command.
