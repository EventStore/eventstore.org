---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Getting Started"
section: "Projections"
version: "4.0.0"
pinned: true
---

Projections can be authored in one of 2 ways. They can either be supplied to Event Store directly via the HTTP API, or you can use the Administration User Interface which provides a section for authoring projections.

## Starting and Configuring Event Store for Projections

The following configuration supplied, starts Event Store with all the projection modes enabled (User Defined as well as System) and uses an in memory database which is suitable for development purposes. 

```bash
EventStore.ClusterNode.exe --run-projections=all --mem-db
```

You should now have an Event Store database up and running with projections enabled. To verify that it's correctly setup and running, you can navigate your browser to `http://localhost:2113`. To login, use the credentials, `username: admin` and `password: changeit`.

Once you are logged into the administration UI, you should see a projections tab at the top and after clicking it, you should see the 4 system projections in a `Stopped` state.

You can separately query the state of all the projections using the API (HTTP).

```bash
curl -i http://localhost:2113/projections/any -H "accept:application/json" | grep -E 'effectiveName|status'
```

The result of the request is a list of all the known projections and useful information about them.

```json
"effectiveName": "$streams"
"status": "Stopped"
"statusUrl": "http://localhost:2113/projection/$streams"

"effectiveName": "$stream_by_category"
"status": "Stopped"
"statusUrl": "http://localhost:2113/projection/$stream_by_category"

"effectiveName": "$by_category"
"status": "Stopped"
"statusUrl": "http://localhost:2113/projection/$by_category"

"effectiveName": "$by_event_type"
"status": "Stopped"
"statusUrl": "http://localhost:2113/projection/$by_event_type"
```

## Setup Sample Data

The following snippets will provide you with some sample data which we will be using throughout this getting started guide.

Filename: `shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1164.json`

Contents:

```json
[
    {
      "eventId"    : "b989fe21-9469-4017-8d71-9820b8dd1164",
      "eventType"  : "ItemAdded",
      "data"       : {
         "Description": "Xbox One S 1TB (Console)",
      },
      "metadata"   : {
         "TimeStamp": "2016-12-23T08:00:00.9225401+01:00"
      }
    },
    {
      "eventId"    : "b989fe21-9469-4017-8d71-9820b8dd1174",
      "eventType"  : "ItemAdded",
      "data"       : {
         "Description": "Gears of War 4",
      },
      "metadata"   : {
         "TimeStamp": "2016-12-23T08:05:00.9225401+01:00"
      }
    }
]
```

Filename: `shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1165.json`

Contents:

```json
[
    {
      "eventId"    : "b989fe21-9469-4017-8d71-9820b8dd1165",
      "eventType"  : "ItemAdded",
      "data"       : {
         "Description": "Xbox One S 500GB (Console)"
      },
      "metadata"   : {
         "TimeStamp": "2016-12-23T09:00:00.9225401+01:00"
      }
    },
    {
      "eventId"    : "b989fe21-9469-4017-8d71-9820b8dd1175",
      "eventType"  : "ItemAdded",
      "data"       : {
         "Description": "Xbox One Elite Controller"
      },
      "metadata"   : {
         "TimeStamp": "2016-12-23T09:05:00.9225401+01:00"
      }
    }
]
```

Filename: `shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1166.json`

Contents:

```json
[
    {
      "eventId"    : "b989fe21-9469-4017-8d71-9820b8dd1166",
      "eventType"  : "ItemAdded",
      "data"       : {
         "Description": "Xbox One S Minecraft Edition (Console)"
      },
      "metadata"   : {
         "TimeStamp": "2016-12-23T10:00:00.9225401+01:00"
      }
    },
    {
      "eventId"    : "b989fe21-9469-4017-8d71-9820b8dd1176",
      "eventType"  : "ItemAdded",
      "data"       : {
         "Description": "Fifa 2016 (Xbox)"
      },
      "metadata"   : {
         "TimeStamp": "2016-12-23T10:05:00.9225401+01:00"
      }
    }
]
```

Filename: `shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1167.json`

Contents:

```json
[
    {
      "eventId"    : "b989fe21-9469-4017-8d71-9820b8dd1167",
      "eventType"  : "ItemAdded",
      "data"       : {
         "Description": "Xbox One Elite (Console)"
      },
      "metadata"   : {
         "TimeStamp": "2016-12-23T10:00:00.9225401+01:00"
      }
    }
]
```


```bash
curl -i -d @"shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1164.json" "http://127.0.0.1:2113/streams/shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1164" -H "Content-Type:application/vnd.eventstore.events+json"
curl -i -d @"shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1165.json" "http://127.0.0.1:2113/streams/shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1165" -H "Content-Type:application/vnd.eventstore.events+json"
curl -i -d @"shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1166.json" "http://127.0.0.1:2113/streams/shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1166" -H "Content-Type:application/vnd.eventstore.events+json"
curl -i -d @"shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1167.json" "http://127.0.0.1:2113/streams/shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1167" -H "Content-Type:application/vnd.eventstore.events+json"
```

## Writing your first projection

Finally we can get to writing the projection itself. The user defined projection's API is documented [here](../user-defined-projections).

We will start off with a simple projection that will count the number of XBox One Ss` that were added to customer's shopping carts.

a Projection starts off with a selector, the one we would most likely be using here is `fromAll()`. There is another one (`fromCategory({category}`)) which we will discuss later on, but for now, fromAll should do.

The second part of the projection is a set of filters and there is a special filter called $init that provides us with the ability to setup some initial state. We want to start our counter from 0 and each time we observe the `ItemAdded` event for an Xbox One S we want to increment this counter.

Here is the projection so far

Filename: `xbox-one-s-counter.json`

Contents:

```javascript
fromAll()
.when({
    $init: function(){
        return {
            count: 0
        }
    },
    ItemAdded: function(s,e){
        if(e.body.Description.indexOf("Xbox One S") >= 0){
            s.count += 1;
        }
    }
})
```

We can create the projection by making a call to the API and provide it with the definition of the projection. We are also making a decision here on how the projection is run. We are saying here that we want the projection to essentially start from the beginning and keep on running into the future.

You can find more information about how to interact with projections in the [API section](../api).

```bash
curl -i --data-binary "@xbox-one-s-counter.json" http://localhost:2113/projections/continuous?name=xbox-one-s-counter%26type=js%26enabled=true%26emit=true%26trackemittedstreams=true -u admin:changeit
```

You should have received a 201 Created response from Event Store, which means that the projection was created successfully. We can confirm that the projection is running by issuing a status request.

```bash
curl -i http://localhost:2113/projection/xbox-one-s-counter | grep status
```

The response should resemble the following.

```bash
"status": "Running",
"statusUrl": "http://localhost:2113/projection/xbox-one-s-counter",
```

## Querying for the state of the projection

Now that the projection is running, we want to query the state of the projection. We can query the state of the projection by issuing yet another request. For a projection that has a single state (more on this later), the request should resemble the following.

```bash
curl -i http://localhost:2113/projection/xbox-one-s-counter/state
```

Which should return the state (json by default)

```bash
{"count":3}%
```

## Writing to streams from Projections

The above gives us the correct result, but this requires us to have to poll for the state of a projection. What if we wanted to be notified of state updates via the use of subscriptions?

## Output State

We could configure the projection to output the state to a stream by calling the `outputState()` method on the projection which by default will produce a `$projections-{projection-name}-result` stream.

Filename: `xbox-one-s-counter-outputState.json`

```javascript
fromAll()
.when({
    $init: function(){
        return {
            count: 0
        }
    },
    ItemAdded: function(s,e){
        if(e.body.Description.indexOf("Xbox One S") >= 0){
            s.count += 1;
        }
    }
}).outputState()
```

To update the projection, we can issue the following request.

```bash
curl -i -X PUT --data-binary "@xbox-one-s-counter-outputState.json" http://localhost:2113/projection/xbox-one-s-counter/query?emit=yes -u admin:changeit
```

We can now read the events in the result stream by issuing a read request.

```bash
curl -i http://localhost:2113/streams/%24projections-xbox-one-s-counter-result\?embed\=body -H "accept:application/json" -u admin:changeit | grep data
```

The response should resemble the following.

```bash
"data": "{\"count\":3}",
"data": "{\"count\":2}",
"data": "{\"count\":1}",
```

<span class="note">
The name of the state stream can be configured via the projection options. <br/>
options({
  resultStreamName: "xboxes"
})
</span>

## Number of items per shopping cart

In the above example, we were relying on a global state for the projection, but what if we wanted to have a simple count of the number of items in the shopping cart per shopping cart.

There is a built in projection that gives us the ability to only select events from a particular list of streams which is the `$by_category` projection. Let's enable this projection now.


```bash
curl -i -d{} http://localhost:2113/projection/%24by_category/command/enable -u admin:changeit
```

The projection will link events from existing streams to new streams by splitting the stream name by a separator. The projection is configurable in that you can specify the position of where it needs to split the stream id and provide your own separator.

For example:

By default the category is determined by splitting the stream id by a dash. The category is the first string.

Stream Name  | Category
------------- | -------------
shoppingCart-54  | shoppingCart
shoppingCart-v1-54  | shoppingCart
shoppingCart | *No category as there is no separator*

With the projection enabled and an explanation behind us, we can continue with defining our projection. What we want to do is define a projection that will produce a count per stream for a category but the state needs to be per stream.

We will make use of the built in system projection `$by_category` that will enable the use of the `fromCategory` API method.

Filename: `shopping-cart-counter.json`

```javascript
fromCategory('shoppingCart')
.foreachStream()
.when({
    $init: function(){
        return {
            count: 0
        }
    },
    ItemAdded: function(s,e){
        s.count += 1;
    }
})
```

Once again, we can create the projection by issuing an HTTP request

```bash
curl -i --data-binary "@shopping-cart-counter.json" http://localhost:2113/projections/continuous?name=shopping-cart-item-counter%26type=js%26enabled=true%26emit=true%26trackemittedstreams=true -u admin:changeit
```

## Querying for the state of the projection by partition

The way that we query for the state of the projection is slightly different due to the way we have partitioned the projection. The way we would query for the state of the projection, we'd have to specify the partition we are interested in and simple enough it's just the name of the stream.

```bash
curl -i http://localhost:2113/projection/shopping-cart-item-counter/state?partition=shoppingCart-b989fe21-9469-4017-8d71-9820b8dd1164
```

Which should return the state (json by default)

```bash
{"count":2}%
```
