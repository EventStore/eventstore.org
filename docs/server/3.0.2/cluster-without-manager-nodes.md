---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Setting up a Cluster using only Database Nodes (OSS)"
section: "Server"
version: 3.0.2
---

<span class="note">
When setting up a cluster you will want an odd number of nodes. This is due to the fact that the Event Store uses a quorum based algorithm to handle high availability. 
</span>

Setting up a cluster of Event Store nodes requires extra parameters over a single Event Store node.

## Internal vs External Communication

All communications in the Event Store have been segregated to different networks. The internal network is for inter-node communication, such as replication, and the external network is used for communication with clients. These communications can be placed on segregated networks if required, this is often a good idea for both performance and security purposes.

This seggregation is achieved by setting two sets of network details, those prefixed with `int` relate to internal communication, and those prefeixed with `ext` relate to external communication.

## Cluster Settings

To set up a cluster of nodes, you need to specify the size of the cluster at the command line using the `--cluster-size` parameter, along with a discovery method for the cluster.

### Gossip Seeds

A cluster can be set up by specifying at least one address for the internal http port of another node on the cluster, these are used as gossip seeds that are used when the node first comes up and needst to begin gossiping. Any node can be a seed, however by giving each node the other nodes in the cluster you ensure that there will always be another node to gossip with if a quorum can be built.

Using gossip seeds as a discovery method involves using the parameter `--discover-via-dns=false` and specifying a comma separated list of gossip seeds with the `--gossip-seed` parameter.

#### Example

```
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log1 --int-ip 192.168.0.1 --ext-ip 192.168.0.1 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --discover-via-dns=false --gossip-seed=192.168.0.2:2113,192.168.0.3:2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log2 --int-ip 192.168.0.2 --ext-ip 192.168.0.2 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --discover-via-dns=false --gossip-seed=192.168.0.1:2113,192.168.0.3:2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log3 --int-ip 192.168.0.3 --ext-ip 192.168.0.3 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --discover-via-dns=false --gossip-seed=192.168.0.1:2113,192.168.0.2:2113
```

### DNS Discovery

A cluster can be set up with DNS discovery by creating a DNS entry that points to all of the nodes in the cluster and then specifying that DNS entry, using the `--cluster-dns` parameter, along with the appropriate port, using the `--cluster-gossip-port` parameter.

<span class="note">
Using DNS discovery relies on all nodes in the cluster running on the same internal HTTP port for gossip.
</span>

#### Example

```
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log1 --int-ip 192.168.0.1 --ext-ip 192.168.0.1 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --cluster-dns mydomain.com --cluster-gossip-port=2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log2 --int-ip 192.168.0.2 --ext-ip 192.168.0.2 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --cluster-dns mydomain.com --cluster-gossip-port=2113
EventStore.ClusterNode.exe --mem-db --log c:\dbs\cluster\log3 --int-ip 192.168.0.3 --ext-ip 192.168.0.3 --int-tcp-port=1111 --ext-tcp-port=1112 --int-http-port=2113 --ext-http-port=2114 --cluster-size=3 --cluster-dns mydomain.com --cluster-gossip-port=2113
```