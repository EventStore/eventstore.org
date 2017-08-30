---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Setting up a Cluster using only Database Nodes (OSS)"
section: "Server"
version: "3.8.1"
---

Effective September of 2013 all of the clustering code for Event Store has been open sourced (under the normal BSD-3 license as the rest of the code). This document will look at how you can setup a highly available cluster using just the open source components.

When setting up a cluster you will generally want an odd number of nodes. This is due to the fact that the Event Store uses a quorum based algorithm to handle high availability. 

## Running on Same Machine

To start with we will set up three nodes running on a single machine run each command in its own console window, remember that you either need admin privileges or have setup ACLs with IIS if running in windows (no configuration should be needed in Unix-like operating systems). Replace "127.0.0.1" with whatever IP address you want to run on. Note that this must be an interface actually present on the machine.

```
start EventStore.ClusterNode.exe --mem-db --log .\logs\log1 --int-ip 127.0.0.1 --ext-ip 127.0.0.1 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=1113 --ext-http-port=1114 --cluster-size=3 --discover-via-dns=false --gossip-seed=127.0.0.1:2113,127.0.0.1:3113
start EventStore.ClusterNode.exe --mem-db --log .\logs\log2 --int-ip 127.0.0.1 --ext-ip 127.0.0.1 --int-tcp-port=2111 --ext-tcp-port=2112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --discover-via-dns=false --gossip-seed=127.0.0.1:1113,127.0.0.1:3113
start EventStore.ClusterNode.exe --mem-db --log .\logs\log3 --int-ip 127.0.0.1 --ext-ip 127.0.0.1 --int-tcp-port=3111 --ext-tcp-port=3112 --int-http-port=3113 --ext-http-port=3114 --cluster-size=3 --discover-via-dns=false --gossip-seed=127.0.0.1:1113,127.0.0.1:2113
```

You should now have three nodes running together in a cluster. If you kill one of the nodes it will continue running. Note that this binds to the loopback interface. To access the Event Store from outside your machine, specify a different IP address for the `--ext-ip` parameter.

## Running on Separate Machines

The main thing of importance here is understanding the "gossip seeds". You are instructing seed locations for when the node first comes up and needs to begin gossiping. Any node can be a seed. By giving each node the other nodes you ensure that there will always be another node to gossip with if a quorum can be built. If you wanted to move this to run on three machines the change would just be changing the ips in the command lines to something such as

```
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log1 --int-ip 192.168.0.1 --ext-ip 192.168.0.1 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --discover-via-dns=false --gossip-seed=192.168.0.2:2113,192.168.0.3:2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log2 --int-ip 192.168.0.2 --ext-ip 192.168.0.2 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --discover-via-dns=false --gossip-seed=192.168.0.1:2113,192.168.0.3:2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log3 --int-ip 192.168.0.3 --ext-ip 192.168.0.3 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --discover-via-dns=false --gossip-seed=192.168.0.1:2113,192.168.0.2:2113
```

## Using DNS

As you can imagine with the above command lines it can be quite annoying and error prone to manually type in all of the other nodes by hand on the command line (especially as the replica set counts go up). Another way that you can configure this is by creating a dns entry that points to all of the nodes in the cluster and then specifying that dns entry on the command line along with the appropriate port

```
EventStore.ClusterNode.exe --log c:\dbs\cluster\log1 --int-ip 192.168.0.1 --ext-ip 192.168.0.1 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --cluster-dns mydomain.com --cluster-gossip-port=2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log2 --int-ip 192.168.0.2 --ext-ip 192.168.0.2 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --cluster-dns mydomain.com --cluster-gossip-port=2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log3 --int-ip 192.168.0.3 --ext-ip 192.168.0.3 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --cluster-dns mydomain.com --cluster-gossip-port=2113
```

*This method is also quite good with HTTP clients as you can avoid using a load balancer and fall back to round robin dns for many deployments.*

## Internal vs External

All communications in the Event Store have been optionally segregated to different networks. Internal networks are for things like replication and external is for talking to clients. These communications can be placed on segregated networks if you desire and it is often a good idea to do so both for performance and security purposes.

To setup an internal network all of the command line parameters provided above have int- options as well. All communications channels also support the enabling of SSL for the connections

## HTTP Clients

If you were wanting to use the HTTP api then you would just put a load balancer in front of the three nodes. It does not matter which node receives a request as the requests will be forwarded internally. With this setup you can lose any one machine with a very easy setup. 

## Native TCP Clients

You can also connect to the cluster using the native TCP interface. The client APIs also support switching between nodes internally. As such if you have a master failover as an example the connection will automatically failover and handle retries to another node. 

In order to setup a connection as above in the command line you can provide gossip seeds to the connection. The client will use the gossip seeds to begin gossiping information about the cluster.

```csharp
EventStoreConnection.Create(
    ConnectionSettings.Create().KeepReconnecting(),
    ClusterSettings.Create()
        .WithGossipTimeoutOf(TimeSpan.FromMilliseconds(500))
        .WithGossipSeeds(new []
                             {
                                 new IPEndPoint(IPAddress.Parse("192.168.0.1"), 2113),
                                 new IPEndPoint(IPAddress.Parse("192.168.0.2"), 2113),
                                 new IPEndPoint(IPAddress.Parse("192.168.0.3"), 2113)
                             }));
```

You can also as in the above example use DNS in order to avoid having to manually specify the seeds. Add the nodes to a DNS record and then specify that DNS entry to the connection to locate nodes.

```csharp
EventStoreConnection.Create(ConnectionSettings.Create()
                                  .KeepReconnecting(),
                            ClusterSettings.Create()
                                  .SetClusterDns("mycluster.com"))
                                  .SetGossipPort(2113)
```

*For those using the closed source version GossipPort is an alias for ManagerPort as the closed source version includes a node manager on each physical node. This allows for controlling many virtual nodes on a machine with easy configuration. The manager also acts as a supervisor for the nodes*

As mentioned the connection will automatically reconnect during node failures. This behaviour can be controlled with options on the ConnectionSettings such as limiting retry attempts or frequency. The connection and durable subscription will even manage a subscription during node failures, you will not even receive duplicated messages over your durable subscription.
