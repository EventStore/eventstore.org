---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Competing Consumers"
section: "HTTP API"
version: "3.8.0"
---

This document walks through the HTTP API for setting up and consuming competing consumer subscription groups. For an overview on competing consumers and how they relate to other subscription types please see the [overview document](/docs/introduction/latest/competing-consumers).

<span class="note">
The Administration UI includes a *Competing Consumers* section where a user is able to create, update, delete and view subscriptions and their statusses.
</span>

## Creating a Persistent Subscription
The first thing to do before attempting to interact with a subscription group is to create one. You will receive an error if you attempt to create a subscription group more than once. This requires admin permissions.

<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}</code></td>
            <td><code>application/json</code></td>
            <td>PUT</td>
        </tr>
    </tbody>
</table>

Query Parameters  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>

<tbody>
        <tr>
            <td><code>stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>subscription_name</code></td>
            <td>The name of the subscription group.</td>
        </tr>
    </tbody>
</table>

Body  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>resolveLinktos</code></td>
            <td>Tells the subscription to resolve link events.</td>
        </tr>
        <tr>
            <td><code>startFrom</code></td>
            <td>Start the subscription from the position-th event in the stream.</td>
        </tr>
        <tr>
            <td><code>extraStatistics</code></td>
            <td>Tells the backend to measure timings on the clients so statistics will contain histograms of them.</td>
        </tr>
        <tr>
            <td><code>checkPointAfterMilliseconds</code></td>
            <td>The amount of time the system should try to checkpoint after.</td>
        </tr>
        <tr>
            <td><code>liveBufferSize</code></td>
            <td>The size of the live buffer (in memory) before resorting to paging.</td>
        </tr>
        <tr>
            <td><code>readBatchSize</code></td>
            <td>The size of the read batch when in paging mode.</td>
        </tr>
        <tr>
            <td><code>bufferSize</code></td>
            <td>The number of messages that should be buffered when in paging mode.</td>
        </tr>
        <tr>
            <td><code>maxCheckPointCount</code></td>
            <td>The maximum number of messages not checkpointed before forcing a checkpoint.</td>
        </tr>
        <tr>
            <td><code>maxRetryCount</code></td>
            <td>Sets the number of times a message should be retried before being considered a bad message.</td>
        </tr>
        <tr>
            <td><code>maxSubscriberCount</code></td>
            <td>Sets the maximum number of allowed subscribers</td>
        </tr>
        <tr>
            <td><code>messageTimeoutMilliseconds</code></td>
            <td>Sets the timeout for a client before the message will be retried.</td>
        </tr>
        <tr>
            <td><code>minCheckPointCount</code></td>
            <td>The minimum number of messages to write a checkpoint for.</td>
        </tr>
        <tr>
            <td><code>namedConsumerStrategy</code></td>
            <td>RoundRobin/DispatchToSingle/Pinned</td>
        </tr>
    </tbody>
</table>

## Updating a Persistent Subscription
You can edit the settings of an existing subscription while it is running. This will however drop the current subscribers and will reset the subscription internally. This requires admin permissions.

<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}</code></td>
            <td><code>application/json</code></td>
            <td>POST</td>
        </tr>
    </tbody>
</table>

Query Parameters  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>subscription_name</code></td>
            <td>The name of the subscription group.</td>
        </tr>
    </tbody>
</table>

Body  

*Same parameters as Creating a Persistent Subscription*

## Deleting a Persistent Subscription

<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}</code></td>
            <td><code>application/json</code></td>
            <td>DELETE</td>
        </tr>
    </tbody>
</table>

Query Parameters  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>subscription_name</code></td>
            <td>The name of the subscription group.</td>
        </tr>
    </tbody>
</table>

## Reading a stream via a Persistent Subscription
By default, reading a stream via a persistent subscription will return a single event per request and will not embed the event properties as part of the response.

<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}  
                      /subscriptions/{stream}/{subscription_name}?embed={embed}  
                      /subscriptions/{stream}/{subscription}/{count}?embed={embed}</code></td>
            <td><code>application/vnd.eventstore.competingatom+xml  
                      application/vnd.eventstore.competingatom+json</code></td>
            <td>GET</td>
        </tr>
    </tbody>
</table>

Query Parameters  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>subscription_name</code></td>
            <td>The name of the subscription group.</td>
        </tr>
        <tr>
            <td><code>count</code></td>
            <td>How many events to return for the request.</td>
        </tr>
        <tr>
            <td><code>embed</code></td>
            <td>
                <code>None, Content, Rich, Body, PrettyBody, TryHarder</code>  
            </td>
        </tr>
    </tbody>
</table>
See the [Reading Streams](../reading-streams) for information regarding the different embed levels

Response  

```
{
  "title": "All Events Persistent Subscription",
  "id": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1",
  "updated": "2015-12-02T09:17:48.556545Z",
  "author": {
    "name": "EventStore"
  },
  "headOfStream": false,
  "links": [
    {
      "uri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/ack%3Fids=c322e299-cb73-4b47-97c5-5054f920746f",
      "relation": "ackAll"
    },
    {
      "uri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/nack%3Fids=c322e299-cb73-4b47-97c5-5054f920746f",
      "relation": "nackAll"
    },
    {
      "uri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/1%3Fembed=None",
      "relation": "previous"
    },
    {
      "uri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1",
      "relation": "self"
    }
  ],
  "entries": [
    {
      "title": "1@newstream",
      "id": "http://localhost:2113/streams/newstream/1",
      "updated": "2015-12-02T09:17:48.556545Z",
      "author": {
        "name": "EventStore"
      },
      "summary": "SomeEvent",
      "links": [
        {
          "uri": "http://localhost:2113/streams/newstream/1",
          "relation": "edit"
        },
        {
          "uri": "http://localhost:2113/streams/newstream/1",
          "relation": "alternate"
        },
        {
          "uri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/ack/c322e299-cb73-4b47-97c5-5054f920746f",
          "relation": "ack"
        },
        {
          "uri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/nack/c322e299-cb73-4b47-97c5-5054f920746f",
          "relation": "nack"
        }
      ]
    }
  ]
}
```

## Acknowledgements
Clients must acknowledge (or not acknowledge) messages in the competing consumer model. If the client fails to respond in the given timeout period, the message will be retried.

Note that you should be using the rel links in the feed for acknowledgements (not bookmark uris as they are subject to change in future versions. EG:

```
{
  "uri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/ack/c322e299-cb73-4b47-97c5-5054f920746f",
  "relation": "ack"
},
```

### Ack multiple messages  
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}/ack?ids={messageids}</code></td>
            <td><code>application/json</code></td>
            <td>POST</td>
        </tr>
    </tbody>
</table>

Query Parameters  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>subscription_name</code></td>
            <td>The name of the subscription group.</td>
        </tr>
        <tr>
            <td><code>messageids</code></td>
            <td>The ids of the messages that needs to be acked</td>
        </tr>
    </tbody>
</table>

### Ack a single message  
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}/ack/{messageid}</code></td>
            <td><code>application/json</code></td>
            <td>POST</td>
        </tr>
    </tbody>
</table>

Query Parameters  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>subscription_name</code></td>
            <td>The name of the subscription group.</td>
        </tr>
        <tr>
            <td><code>messageid</code></td>
            <td>The id of the message that needs to be acked</td>
        </tr>
    </tbody>
</table>

### Nack multiple messages  
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}/nack?ids={messageids}?action={action}</code></td>
            <td><code>application/json</code></td>
            <td>POST</td>
        </tr>
    </tbody>
</table>

Query Parameters  

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream</code></td>
            <td>The stream to the persistent subscription is on.</td>
        </tr>
        <tr>
            <td><code>subscription_name</code></td>
            <td>The name of the subscription group.</td>
        </tr>
        <tr>
            <td><code>action</code></td>
            <td> 
              <ul>
                <li>Park: Don’t retry the message, park it until a request is sent to reply the parked messages</li>
                <li>Retry: Retry the message</li>
                <li>Skip: Discard the message</li>
                <li>Stop: Stop the subscription </li>
              </ul>
            </td>
        </tr>
        <tr>
            <td><code>messageid</code></td>
            <td>The id of the message that needs to be acked</td>
        </tr>
    </tbody>
</table>

### Nack a single message  
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}/nack/{messageid}?action={action}</code></td>
            <td><code>application/json</code></td>
            <td>POST</td>
        </tr>
    </tbody>
</table>

## Replaying parked messages  
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}/replayParked</code></td>
            <td><code>application/json</code></td>
            <td>POST</td>
        </tr>
    </tbody>
</table>

## Getting information for all subscriptions
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions</code></td>
            <td><code>application/json</code></td>
            <td>POST</td>
        </tr>
    </tbody>
</table>
Response  

```
[
  {
    "links": [
      {
        "href": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/info",
        "rel": "detail"
      }
    ],
    "eventStreamId": "newstream",
    "groupName": "competing_consumers_group1",
    "parkedMessageUri": "http://localhost:2113/streams/$persistentsubscription-newstream::competing_consumers_group1-parked",
    "getMessagesUri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/1",
    "status": "Live",
    "averageItemsPerSecond": 0.0,
    "totalItemsProcessed": 0,
    "lastProcessedEventNumber": -1,
    "lastKnownEventNumber": 5,
    "connectionCount": 0,
    "totalInFlightMessages": 0
  },
  {
    "links": [
      {
        "href": "http://localhost:2113/subscriptions/another_newstream/competing_consumers_group1/info",
        "rel": "detail"
      }
    ],
    "eventStreamId": "another_newstream",
    "groupName": "competing_consumers_group1",
    "parkedMessageUri": "http://localhost:2113/streams/$persistentsubscription-another_newstream::competing_consumers_group1-parked",
    "getMessagesUri": "http://localhost:2113/subscriptions/another_newstream/competing_consumers_group1/1",
    "status": "Live",
    "averageItemsPerSecond": 0.0,
    "totalItemsProcessed": 0,
    "lastProcessedEventNumber": -1,
    "lastKnownEventNumber": -1,
    "connectionCount": 0,
    "totalInFlightMessages": 0
  }
]
```

## Getting information about the subscriptions for a stream  
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}</code></td>
            <td><code>application/json</code></td>
            <td>GET</td>
        </tr>
    </tbody>
</table>
Response  

```
[
  {
    "links": [
      {
        "href": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/info",
        "rel": "detail"
      }
    ],
    "eventStreamId": "newstream",
    "groupName": "competing_consumers_group1",
    "parkedMessageUri": "http://localhost:2113/streams/$persistentsubscription-newstream::competing_consumers_group1-parked",
    "getMessagesUri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/1",
    "status": "Live",
    "averageItemsPerSecond": 0.0,
    "totalItemsProcessed": 0,
    "lastProcessedEventNumber": -1,
    "lastKnownEventNumber": 5,
    "connectionCount": 0,
    "totalInFlightMessages": 0
  }
]
```

## Getting information about a specific subscription  
<table>
    <thead>
        <tr>
            <th>URI</th>
            <th>Supported Content Types</th>
            <th>Method</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/subscriptions/{stream}/{subscription_name}/info</code></td>
            <td><code>application/json</code></td>
            <td>GET</td>
        </tr>
    </tbody>
</table>
Response  

```
{
  "links": [
    {
      "href": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/info",
      "rel": "detail"
    },
    {
      "href": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/replayParked",
      "rel": "replayParked"
    }
  ],
  "config": {
    "resolveLinktos": false,
    "startFrom": 0,
    "messageTimeoutMilliseconds": 10000,
    "extraStatistics": false,
    "maxRetryCount": 10,
    "liveBufferSize": 500,
    "bufferSize": 500,
    "readBatchSize": 20,
    "preferRoundRobin": true,
    "checkPointAfterMilliseconds": 1000,
    "minCheckPointCount": 10,
    "maxCheckPointCount": 500,
    "maxSubscriberCount": 10,
    "namedConsumerStrategy": "RoundRobin"
  },
  "eventStreamId": "newstream",
  "groupName": "competing_consumers_group1",
  "status": "Live",
  "averageItemsPerSecond": 0.0,
  "parkedMessageUri": "http://localhost:2113/streams/$persistentsubscription-newstream::competing_consumers_group1-parked",
  "getMessagesUri": "http://localhost:2113/subscriptions/newstream/competing_consumers_group1/1",
  "totalItemsProcessed": 0,
  "countSinceLastMeasurement": 0,
  "lastProcessedEventNumber": -1,
  "lastKnownEventNumber": 5,
  "readBufferCount": 6,
  "liveBufferCount": 5,
  "retryBufferCount": 0,
  "totalInFlightMessages": 0,
  "connections": []
}
```