---
title: "Ensuring writes – multi-node replication"
date: 2013-03-01T16:08Z
author: "Greg Young"
layout: blog-post
category: "Articles"
tags: ["Event Store","Nodes","Event sourcing"]
---

We have gotten the question very often how the multi-node version works with replication. After typing it up about five times in email I figured it might be valuable to do a longer write-up that we can suck into our documentation (and a blog post).

One could quite easily put the Event Store Open Source version running on a virtual machine with data storage on a SAN. If the first machine goes wrong for some reason the VM is spun back up on a different host with connection to the same SAN. This is a perfectly valid way of handling a failover. There are some issues that come up with it however. The largest is the amount of downtime in the middle with a close second being a whole slew of byzantine problems that can occur (network reachability issues as an example)

This is not by any means a "bad" system. The Event Store however uses a different model for its replication that comes with its own strengths and weaknesses.

The Event Store uses a quorum based model for replication. As of now all replication is fully consistent though we have talked about other models in the future (more discussion further). When you use a quorum based model you almost always want to have an odd number of servers.

When a server is brought up it will use the dns given to it to find other nodes in its replication group. There is a config point for the predetermined quorum size of the group. It will begin gossiping with these other servers over http until it can get some information about the other nodes that are there.

If there is no quorum yet a Paxos Election will then occur to determine which of the nodes is to be the leader of the replication group (for right now). The Paxos Election basically says that all nodes will agree upon a leader, or none of them will think that they have agreed upon a leader. Once the leader is picked, the leader can begin accepting write transactions (other nodes forward writes to the leader, clients do not need to be aware of the leader).

Every write even in the Single Node open sourced version has a small manager that controls it's lifecycle. It will write a prepare followed by a commit. This is done for various reasons not the least of which is transactional writes are supported. It is also used in replication.

The manager will first send out a Prepare of the write. This will go to its local storage writer which will reply with an ACK once the item has been fsynced to disk. The item is also asynchronously dispatched to the other nodes. The manager will not send its commit until a quorum of nodes has acknowledged the message as being fsynced to disk.

If a failure happens during the process of a prepare the commit will never happen, the client will be told that the transaction timed out (or perhaps the connection was lost if the leader was the one that died). The client's responsibility in all cases is to retry, the Event Store is idempotent. The C# client will do this automatically for you. This client retrying also handles the case that the manager sent a commit and then died (not sending client a response). Again the client retries in this case. This also holds true in a multi-node scenario.

The interesting case that comes up here is when a commit has been written in the leader but it dies before distributing it to the other nodes and getting acks. The old leader will actually truncate in the process of coming back into the cluster (the client was never told the transaction was committed and thus will retry with the new leader who will know whether or not it was committed).

The key to the style of replication is the two quorums being used. Since a transaction is only considered written when a majority of nodes have it, when an election happens (also requires a quorum) you are assured that one node in the election will have the item or the election will to build a quorum. To illustrate let's try an example. To illustrate the example let's imagine that we are dealing with an incrementing sequence number.

- Node A Leader -> 5555
- Node B -> 5553
- Node C -> 5554

- Node A sends commit on 5555 and moves to 5556
- Node C acks 5555

- Node A Leader -> 5556
- Node B -> 5553
- Node C -> 5555

Now the leader dies.

- Node A dead -> 5556
- Node B -> 5553
- Node C -> 5555

Nodes B/C have an election. They decide that C is the winner as it has more information than B, thus C is the new leader and sends B 5554 and 5555. The client on 5556 will receive a dropped connection and will retry 5556 with C. If both nodes A and B were dead. C would not be capable of creating a quorum. As such C would enter into read-only mode.

This replication model ensures consistency throughout the replica group and is a well known replication model. It has some strengths and weaknesses operationally over other models.

A main strength is that its fully consistent. There are not possibilities of conflicting data on different nodes (eg A accepted a write without seeing the write to C). For most business systems this is a huge gain as dealing with these rare problems often gets looked over when using models that allows them.

Another strength is that failovers happen very quickly with minimal impact on clients. This is especially true when you consider that the nodes internally route so the client does not need to in most cases know who the leader is. Along with this, for a group of three nodes, so long as any two are up and communicating the system is considered running and consistent.

The main weakness of the model is largely from the point of view that its consistent. If a quorum is unable to be built, the system will no longer accept writes and it will be readonly. This weakness also brings us to a strength of event sourcing. Keeping events locally in the application and synchronizing them later is actually a pretty easy process if you want to have eventuallly consistent behaviour with the Event Store.