---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Competing Consumers Introduction"
section: "Introduction"
version: "3.5.0"
---

Beginning with **3.2.0** a new subscription model is available in Event Store. This model is known as competing consumers and is very similar to subscriptions models you may have dealt with in the past such as AMQP. This document serves as a high level overview of the functionality, what it can provide, and when you may want to use it.

<span class="note">Competing Consumers only exists in version **3.2.0** and above. Please see specific version documentation in order to gain more details on methods names etc.</span>

## What is Competing Consumers

Competing Consumers is another subscription model that is available, it differs in usage from the Subscribe operation or from a CatchUpSubscription in terms of how it works. SubscribeToStream as example will read the events from this point forward that happen in a stream. A CatchUpSubscription will read all the events in a stream to your client from a given point.

Both a Subscription and a CatchupSubscription use a model where the client holds the state of the subscription much like with a blog client your client remembers the last post that you have read. The server does not hold any state particular to a given client.  Competing Consumers operate differently, with Competing Consumers the server remembers the state of the subscription. This allows for many different modes of operations compared to a subscription where the client holds the subscription state.

## Subscription Groups

The first step in using Competing Consumers is to create a new subscription. This can be done either over the http api or through the client api (CreatePersistentSubscription) at this point. This will create the server side subscription group that you will be able to use in the future. There are lots of options that can be passed to a subscription group including things such as ReadBatchSizes, MaxRetryCounts, and how often to CheckPoint the subscription. The creation of the subscription is normally done as part of a deployment or an administrative task.

Subscription groups can be created to map to any stream. As an example you could create a consumer group foo on the stream bar.

```
/subscriptions/bar/foo
```

You can also create multiple subscription groups on a single stream.

```
/subscriptions/bar/foo
/subscriptions/bar/baz
```

One major difference with client based subscriptions is that a subscription group can then have N clients connect to it. The subscription group as a whole represents the subscription. If you connect three clients to a subscription group only one of the clients will normally receive the message not all three as it would work with three CatchUpSusbcriptions.

<span class="note">It will be discussed later in this document but in the case of retries, connection failures, or server failures more than one subscriber in a subscriber group can see a given message this model is known as At-Least-Once messaging clients must be able to handle receiving a message more than one time.</span>

The next step is connecting a client to the subscription group. In the .NET client api there is a method ConnectToPersistentSubscription which takes the stream/group that you want to connect to. It also takes a parameter which is the maximum number of in flight messages. This parameter is key to understanding how the subscription group works.

When a message is dispatched to a client of the subscription group it is considered "In Process" until it is Acknowledged by the client, Not Acknowledged by the client, or timed out. The in flight messages limit refers to how many messages can be "In Process" at a given point in time by a client, each client sets their limit at their time of connection. Once you have reached this limit the server will not push another message to your client until a slot becomes available due to an "In Process" message being marked no longer in process. 

As such if you had 7 messages in a subscription and two clients (A/B) (A is allowed 2, B 3) the subscription would push messages 1,2 to client A and 3,4,5 to client B. Message 6 would not be able to be processed until one of the messages 1,2,3,4,5 were moved from the "In Process" by an ack, nak, or timeout from clients A or B. 

The most common mechanism for a slot becoming open would be that client A(or B) returns an Acknowledgement that they have processed say message 1. They can also return a Not Acknowledgement of a message with hints to the server as to what to do with the message (skip/retry/park/server decides). A timeout of the message (which is configurable) is another way this can happen.

<span class="note">The tuning of the maximum number of inflight messages and message timeouts are very important when looking at overall subscription performance.</span>

## Parked Messages

One option that can be returned with a Not Acknowledged is that the message will not be able to be processed on retries and should be parked (this is also known as a dead letter queue). Messages can also be parked due to them being retried more than a certain number of times.

For every subscription group there also exists another stream known as the parked message queue. The parked message queue can be replayed at any point to the subscription group either via the UI or via the restful interface for competing consumers. For more information please see version specific information. It is important in a production environment to monitor the count of parked messages as these represent messages that were **not** delivered to the subscriber group as there were failures.

## Checkpoints

As the subscription is being processed, occasionally it will write in a persistent way the place it currently knows that all messages prior have been processed. This is done so in the case of a server restart or a crash the subscription group can continue from this point as opposed to starting from the beginning of the subscription. If running in a clustered version the subscription groups will move to another server in the case of a crash and will be restarted from their last checkpoint. A reload to a checkpoint can cause a subscription to duplicate messages that are ahead of the latest checkpoint but have been acknowledged.

How the server checkpoints is controlled by configuration settings on the subscription group. You can control how often checkpoints are written via three main config points CheckpointInterval, MinToCheckpoint, and MaxToCheckpoint. The interval say 3 seconds will write a checkpoint on the interval providing the number of messages to checkpoint is greater than MinToCheckpoint. When MaxToCheckpoint is reached a checkpoint will always be written. Say you had interval at one second, MinToCheckpoint at 5 and MaxToCheckpoint at 10 (these numbers are normally much bigger for busy subscriptions)

```
interval hit: messages = 3 //no checkpoint written
on ack: messages = 4 //no checkpoint written
interval hit: messages = 4 //no checkpoint written
on ack: messages = 5 //no checkpoint written
on interval hit: messages = 5 //checkpoint written
or 
on ack messages=10 //checkpoint written
```

Understanding how checkpointing works and paying careful attention to the behaviour of your stream can help reduce server workload and help prevent receiving too many repeated messages in the case of a server failover. On a stream doing very few messages the above settings are fine. On a stream doing a few hundred or thousand messages per second you obviously would want these values to be significantly higher. A general rule of thumb is maximum should be 1-5 seconds of message throughput.

<span class="note">The checkpoints themselves are stored in streams and are often recycled quickly. For this reason it is generally recommended that you occasionally run a scavenge process on your servers if using competing consumers.</span>

## When to Use Competing Consumers

As mentioned throughout this document there are many pros and cons when comparing client based vs server based subscription models. The table below summarizes some of these trade offs.

<table>
    <thead>
        <tr>
            <th>Feature</th>
            <th>Client Based</th>
            <th>Server Based</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Many clients connected</td>
            <td>Yes</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Clients receive all messages</td>
            <td>Yes</td>
            <td>No</td>
        </tr>
        <tr>
            <td>Monitorable</td>
            <td>No*</td>
            <td>Yes</td>
        </tr>        
        <tr>
            <td>Assured Ordering</td>
            <td>Yes</td>
            <td>No</td>
        </tr>
        <tr>
            <td>Requires Configuration</td>
            <td>No</td>
            <td>Yes</td>
        </tr>        
        <tr>
            <td>Load balancing</td>
            <td>No*</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>HA clients</td>
            <td>No*</td>
            <td>Yes</td>
        </tr>
    </tbody>
</table>

Competing Consumers will allow you to connect one or many clients to a given subscription group. This can allow for things like load balancing the work across them or making the clients themselves highly available easily. If you lose a client the workload will just be spread over the other connected clients. With a CatchupSubscription it is very difficult to make a highly available subscriber (its duplicate everything) load balancing is also quite difficult as with a CatchUpSubscription each client will receive every message.

For something like a projection of an event stream into a read model a client will generally prefer to use a CatchUpSubscription as opposed to a competing consumer group. This is because when doing this process receiving the events in order is very important. Any time that ordering becomes a primary concern a CatchUpSubscription is probably the best bet.

Another tradeoff to consider is that since with a server based subscription the state of the subscription is on the server you can centrally monitor the subscriptions from a single point. If they are client based subscriptions this can be done as well providing all your client subscriptions store their state in a particular place but it is left to the user to implement this.

## Monitoring

All subscriber state can be monitored within the Event Store. This can either be done through the UI (subscriptions tab) or it can be done via the restful API (currently http://yourserver/subscriptions). All competing consumer subscriptions can be monitored here and there are some nice dashboards to see what is going on.

Generally the most important thing to monitor is the relationship between the lastProcessedMessage, the lastKnownMessage, and the throughput of the subscription. This is basically telling you the last processed message was x the last known message is y and your current throughput is t. X - Y / t gives you a rough estimate of how far behind the subscription group is from live.

Another important thing you can measure is your clients. Every time a message is passed to a client you can enable that it will be timed, clock starting on the push stopping on the ack/nak. If you enable this functionality via the "extrastatistics" configuration option the subscription will track a histogram of the timings of the client(s). From this histogram you can get such statistics as average, standard deviation, quintiles, and %s (90,95,99,99.9,etc) about how your client is behaving in terms of timings.
