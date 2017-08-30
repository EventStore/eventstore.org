---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Ports and networking"
section: "Server"
version: "3.5.0"
---

## Single Node

Event Store run as a single node will only use two ports. The first port is the external http port. This is used for both the client http apis and for the management http interface, the default for the external http port is 2113. The second port used is the tcp interface for clients connecting over the client API the default for the tcp port is 1113.

Event Store in windows will try to add access via http.sys automatically for the 2113 port.

You should ensure that these ports are open and allowed via firewall if you are using a firewall on the machine.

## Cluster Node

When running in cluster mode the networking for Event Store is a bit more complex. Cluster mode requires 4 ports in order to run. The ports are internal http, internal tcp, external http, and external tcp.

The general idea behind the internal vs external interfaces is to allow for separation of traffic. The internal network is where all cluster communications runs while the external interfaces is where all client communications runs. This allows for many interesting setups such as putting internal communications on a different network than external client communications. You may wish to do this for many reasons including putting them on separate NICs, locking down internal communications from a security perspective, or just for separating networks for security purposes. A good example of this might be when allowing clients over http to talk directly to Event Store, internal communications can be moved to a separate network to ensure things like the management interface and internal operations are not accessible from the outside.

The external tcp and http are similar to the http and tcp ports of a single node deploy. Client requests over the http api are run through the external http port. You may however with to run without the management api on the external interface (internal only). Gossip is supported both on the external and the internal interfaces. You can control whether the admin interface is available on the external http interface using the admin-on-ext option. You can control whether gossip is enable on external with the gossip-on-ext option (though you normally want it).

The internal tcp and http are configured similarly to the external. All internal communications for the cluster happen over these interfaces. Elections and internal gossip happen over http. Replication and forwarding of client requests happens over the tcp channel.

When setting up a cluster the nodes must be able to reach each other over both the internal http channel and the internal tcp channel. You should ensure that these ports are open on firewalls etc both on the machines and between the machines.

## Heartbeat Timeouts

Event Store uses heartbeats over all tcp connections to attempt to discover dead clients/nodes. Setting heartbeat timeouts can be tricky, set them too short and you will get false positives, set them too long and discovery of dead clients/nodes becomes slower.

Each heartbeat has two points of configuration. The first is the interval, this represents how often the system should consider a heartbeat. There will not be a heartbeat sent for every interval. Heartbeats work by saying "if I have not received something from this node within the last interval send a heartbeat request". As such on a busy system you will not actually send any heartbeats. The second point of configuration is the timeout, when a heartbeat is sent how long should be allowed for the client/node to respond to the heartbeat request.

Varying environments want drastically different values for these settings. While low numbers work well on a LAN they tend to not work very well in the cloud. The defaults are likely fine on a LAN, in the cloud consider a setting of interval 5000ms timeout 1000ms which should be fine for most installations.

*If in question error on the side of higher numbers, it will only add a small period of time to discover a dead client/node and is likely better than the alternative which is false positives.*

## Advertise As

There are times when due to NAT or other reasons a node may not be bound to the address it is actually reachable from other nodes as. As an example the machine could have an ip address of 192.168.1.13 but the node is visible to other nodes as 10.114.12.112.

There is an option for the node advertise-as which allows you to tell the node that even though it is bound to a given address it should not gossip that address as its address. Instead it will use the address that you tell it to use. In the example above you would configure

```
--ext-ip 192.168.1.13 --advertise-as 10.114.12.112
```

or use the equivalent configuration via environment variables or config file.