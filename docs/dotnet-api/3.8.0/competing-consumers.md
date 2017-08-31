---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Competing Consumers"
section: ".NET API"
version: "3.8.0"
---

This document walks through the .NET client API for setting up and consuming competing consumer subscription groups. For an overview on competing consumers and how they relate to other subscription types please see [the overview document](/docs/introduction/latest/competing-consumers).

# Methods

## Creating a Persistent Subscription

```csharp
Task<PersistentSubscriptionCreateResult> CreatePersistentSubscriptionAsync(string stream, string groupName, PersistentSubscriptionSettings settings, UserCredentials credentials);
```

## Updating a Persistent Subscription

```csharp
Task<PersistentSubscriptionUpdateResult> UpdatePersistentSubscriptionAsync(string stream, string groupName, PersistentSubscriptionSettings settings, UserCredentials credentials);
```

## Deleting a Persistent Subscription

```csharp
Task<PersistentSubscriptionDeleteResult> DeletePersistentSubscriptionAsync(string stream, string groupName, UserCredentials userCredentials = null);
```

## Connecting to a Persistent Subscription

```csharp
        EventStorePersistentSubscription ConnectToPersistentSubscription(
            string groupName, 
            string stream, 
            Action<EventStorePersistentSubscription, ResolvedEvent> eventAppeared,
            Action<EventStorePersistentSubscription, SubscriptionDropReason, Exception> subscriptionDropped = null,
            UserCredentials userCredentials = null,
            int bufferSize = 10,
            bool autoAck = true);
```

## Persistent Subscription Settings

Both the `Create` and `Update` methods take a `PersistentSubscriptionSettings` object as a parameter. This object is used to provide the settings for the persistent subscription. There is also a fluent builder for these options that can be located using the `Create()` method. The following table shows the options that can be set on a persistent subscription.

<table>
    <thead>
        <tr>
            <th>Member</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>ResolveLinkTos</code></td>
            <td>Tells the subscription to resolve link events.</td>
        </tr>
        <tr>
            <td><code>DoNotResolveLinkTos</code></td>
            <td>Tells the subscription to not resolve link events.</td>
        </tr>
        <tr>
            <td><code>PreferRoundRobin</code></td>
            <td>If possible prefer to round robin between the connections with messages (if not possible will use next available).</td>
        </tr>
        <tr>
            <td><code>PreferDispatchToSingle</code></td>
            <td>If possible prefer to dispatch to a single connection (if not possible will use next available).</td>
        </tr>
        <tr>
            <td><code>StartFromBeginning</code></td>
            <td>Start the subscription from the first event in the stream.</td>
        </tr>
        <tr>
            <td><code>StartFrom(int position)</code></td>
            <td>Start the subscription from the position-th event in the stream.</td>
        </tr>
        <tr>
            <td><code>StartFromCurrent</code></td>
            <td>Start the subscription from the current position.</td>
        </tr>
        <tr>
            <td><code>WithMessageTimeoutOf(TimeSpan timeout)</code></td>
            <td>Sets the timeout for a client before the message will be retried.</td>
        </tr>
        <tr>
            <td><code>CheckPointAfter(TimeSpan time)</code></td>
            <td>The amount of time the system should try to checkpoint after.</td>
        </tr>
        <tr>
            <td><code>MinimumCheckPointCountOf(int count)</code></td>
            <td>The minimum number of messages to write a checkpoint for.</td>
        </tr>
       <tr>
            <td><code>MaximumCheckPointCountOf(int count)</code></td>
            <td>The maximum number of messages not checkpointed before forcing a checkpoint.</td>
        </tr>
        <tr>
            <td><code>WithMaxRetriesOf(int count)</code></td>
            <td>Sets the number of times a message should be retried before being considered a bad message.</td>
        </tr>
        <tr>
            <td><code>WithLiveBufferSizeOf(int count)</code></td>
            <td>The size of the live buffer (in memory) before resorting to paging.</td>
        </tr>
        <tr>
            <td><code>WithReadBatchOf(int count)</code></td>
            <td>The size of the read batch when in paging mode.</td>
        </tr>
        <tr>
            <td><code>WithBufferSizeOf(int count)</code></td>
            <td>The number of messages that should be buffered when in paging mode.</td>
        </tr>
        <tr>
            <td><code>WithExtraStatistics</code></td>
            <td>Tells the backend to measure timings on the clients so statistics will contain histograms of them.</td>
        </tr>        
    </tbody>
</table>

## Creating a Subscription Group

The first step of dealing with a subscription group is that it must be created. Note you will get an error if you attempt to create a subscription group multiple times. You must have admin permissions to create a persistent subscription group.

<span class="note">Normally the creating of the subscription group is not done in your general executable code. Instead it is normally done as a step during an install or as an admin task when setting things up. You should assume the subscription exists in your code.</span>

```csharp
PersistentSubscriptionSettings settings = PersistentSubscriptionSettings.Create()
                                                                .DoNotResolveLinkTos()
                                                                .StartFromCurrent();
_result = _conn.CreatePersistentSubscriptionAsync(_stream, 
												  "agroup", 
												  settings, 
												  MyCredentials).Result;                            
```

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>string groupName</code></td>
            <td>The name of the subscription group to create.</td>
        </tr>
        <tr>
            <td><code>PersistentSubscriptionSettings settings</code></td>
            <td>The settings to use when creating this subscription.</td>
        </tr>
        <tr>
            <td><code>UserCredentials credentials</code></td>
            <td>The user credentials to use for this operation.</td>
        </tr>        
    </tbody>
</table>


## Updating a Subscription Group

You can also edit the settings of an existing subscription group while it is running, it is not needed to delete and recreate it to change settings. When you update the subscription group however it will reset itself internally dropping the connections and having them reconnect. You must have admin permissions to update a persistent subscription group.

```csharp
PersistentSubscriptionSettings settings = PersistentSubscriptionSettings.Create()
                                                                .DoNotResolveLinkTos()
                                                                .StartFromCurrent();
_result = _conn.UpdatePersistentSubscriptionAsync(_stream, 
												  "agroup", 
												  settings, 
												  MyCredentials).Result;                            
```

<span class="note">If you change settings such as start from beginning, this will not reset the groups checkpoint. If you want to change the current position in an update you must delete and recreate the subscription group.<span>

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>string groupName</code></td>
            <td>The name of the subscription group to update.</td>
        </tr>
        <tr>
            <td><code>PersistentSubscriptionSettings settings</code></td>
            <td>The settings to use when updating this subscription.</td>
        </tr>
        <tr>
            <td><code>UserCredentials credentials</code></td>
            <td>The user credentials to use for this operation.</td>
        </tr>        
    </tbody>
</table>

## Deleting a Subscription Group

At times you may wish to remove a subscription group. This can be done with the delete operation. Much like the creation of groups this is rarely done in your runtime code and normally done by an administrator who is say running a script.

```csharp
var result = _conn.DeletePersistentSubscriptionAsync(stream, 
                                                     "groupname", 
                                                     DefaultData.AdminCredentials).Result;
```
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>string groupName</code></td>
            <td>The name of the subscription group to update.</td>
        </tr>
        <tr>
            <td><code>UserCredentials credentials</code></td>
            <td>The user credentials to use for this operation.</td>
        </tr>        
    </tbody>
</table>


## Connecting to a Subscription Group

Once you have created a subscription group N clients can connect to that subscription group. In general a subscription in your application should only have the connect in your code, you should assume that the subscription has been previously created either via the client API, the restful API, or manually in the UI.

The most important parameter to pass when connecting is the buffer size. This represents how many outstanding messages the server should allow this client. If this number is too small your subscription will spend much of its time idle as it waits for an acknowledgement to come back from the client. If its too big you will be wasting resources and can possibly even start timing out messages depending on the speed of your processing.

```csharp
var subscription = _conn.ConnectToPersistentSubscription("foo",
    									"nonexisting2",
    									(sub, e) => Console.Write("appeared"),
    									(sub, reason, ex) =>{});
```

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>string groupName</code></td>
            <td>The name of the subscription group to connect to.</td>
        </tr>
        <tr>
            <td><code>Action<EventStorePersistentSubscription, ResolvedEvent> eventAppeared</code></td>
            <td>The action to call when an event arrives over the subscription.</td>
        </tr>
        <tr>
            <td><code>Action<EventStorePersistentSubscription, SubscriptionDropReason, Exception> subscriptionDropped</code></td>
            <td>The action to call if the subscription is dropped.</td>
        </tr>
        <tr>
            <td><code>UserCredentials credentials</code></td>
            <td>The user credentials to use for this operation.</td>
        </tr>
        <tr>
            <td><code>int bufferSize</code></td>
            <td>The number of in-flight messages this client is allowed.</td>
        </tr>
        <tr>
            <td><code>bool autoAck</code></td>
            <td>Whether or not to automatically acknowledge messages after eventAppeared returns.</td>
        </tr>                        
    </tbody>
</table>


## Acknowledgements

Clients must acknowledge (or not acknowledge) messages in the competing consumer model. If you enable auto-ack the subscription will automatically acknowledge messages once they are completed by your handler. If you throw an exception it will shutdown your subscription with a message and the uncaught exception.

You can however choose to not auto-ack messages. This can be quite useful when you have multi-threaded processing of messages in your subscriber and need to pass control to something else. There are methods on the subscription object that you can call `Acknowledge` and `NotAcknowledge` both take a `ResolvedEvent` (the one you processed) both also have overloads for passing and `IEnumerable<ResolvedEvent>`.


## Consumer Strategies

When creating a persistent subscription the settings allow for different consumer strategies via the WithNamedConsumerStrategy method. Built in strategies are defined in the enum `SystemConsumerStrategies`. 

<span class="note">HTTP clients bypass the consumer strategy. This means any ordering or pinning will be ignored.<span>

<table>
    <thead>
        <tr>
            <th>Strategy Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>RoundRobin (default)</td>
            <td>Distributes events to all clients evenly. If the client bufferSize is reached the client is ignored until events are acknowledged/not acknowledged.</td>
		</tr> 
		<tr>
			<td>DispatchToSingle</td>
            <td>Distributes events to a single client until the bufferSize is reached. After which the next client is selected in a round robin style and the process is repeated.</td>
		</tr> 
		<tr>
			<td>Pinned</td>
            <td>
				For use with an indexing projection such as the system $by_category projection.
				<p/>
				Each event is inspected for it's source stream id. This id is hashed to one of 1024 buckets which are assigned to individual clients. When a client disconnects it's buckets are assigned to other clients. When a client connects it is assigned some of the existing buckets. This naively attempts to maintain a balanced work load.
				<p/>
				The main aim of this strategy is to decrease the likelihood of concurrency and ordering issues whilst maintaining load balancing. *This is not a guarantee* and the usual ordering and concurrency issues must be handled.
			</td>
        </tr>                   
    </tbody>
</table>