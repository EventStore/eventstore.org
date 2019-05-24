---
title: "Playing with Projections"
author: "Chris Ward"
layout: blog-post
---

Projections are common concept in event sourcing that allow you to create queries of your events and streams of events. Last year I attended Michel Grootjans's "[playing with projections](https://github.com/michelgrootjans/playing_with_projections)" workshop that taught attendees how to create projections in a variety of programming languages. I decided to convert the workshop exercises to use [Event Store's internal projections](/docs/projections/index.html) engine and show how to use our projections API.

The data set is player interactions with a quiz. Visit the workshop wiki to see [the full event list](https://github.com/michelgrootjans/playing_with_projections/raw/master/event-types.pdf), and [the projection exercises](https://github.com/michelgrootjans/playing_with_projections/wiki#the-basic-challenges). In this first part we setup Event Store, import our data, and create two projections. Future posts will create the other projections from the workshop.

## Install and setup Event Store

If you don't have EventStore installed already, find the instructions for your development platform [in our documentation](/docs/getting-started/index.html).

Start EventStore with the following command to enable projections:

### Windows

```powershell
EventStore.ClusterNode.exe --run-projections=all --start-standard-projections=true
```

### Linux

Add `EVENTSTORE_RUN_PROJECTIONS=All` and `EVENTSTORE_START_STANDARD_PROJECTIONS=true` to your environment variables, or the _/etc/eventstore/eventstore.conf_ configuration file and start Event Store:

```bash
sudo systemctl start eventstore
```

### Docker

The Event Store Docker image has projections enabled by default, but you need to enable standard projections:

```bash
docker run --name eventstore-node -it -p 2113:2113 -p 1113:1113 -e EVENTSTORE_RUN_PROJECTIONS=All -e EVENTSTORE_START_STANDARD_PROJECTIONS=true eventstore/eventstore
```

### macOS

```bash
eventstore --run-projections=all --start-standard-projections=true
```

## Finding Data for your Event Store Dashboard

The "Playing with projections" workshop has a series of data files in the _data_ folder you can use for test data. They vary in size and event types, and we recommend you start with a smaller one such as _1.json_ that contains a couple of hundred events, and work through the larger files if you wish. We have changed the original data to suit [the EventStore schema](/docs/http-api/creating-writing-a-stream/index.html?tabs=tabid-1%2Ctabid-3%2Ctabid-5%2Ctabid-7%2Ctabid-17%2Ctabid-11%2Ctabid-13%2Ctabid-15#event-store-media-types), and you can find that fork on [GitHub](https://github.com/EventStore/playing_with_projections).

Create the stream (called "quiz") and events, for example with the [HTTP API](/docs/http-api/creating-writing-a-stream/index.html):

```shell
curl -i -d "@1.json" "http://127.0.0.1:2113/streams/quiz" -H "Content-Type:application/vnd.eventstore.events+json"
```

Open the admin dashboard (_{SERVER_IP}:2113_) and click the _streams_ tab to see the newly created stream.

![Quiz stream](/images/new-stream.png)

## Writing Your Projection

For this post we use the _Projections_ tab, and the _New Projections_ button of the admin UI. You can also use [the .NET API or HTTP API](/docs/getting-started/projections/index.html?tabs=tabid-1%2Ctabid-4%2Ctabid-http-api%2Ctabid-create-proj-bash%2Ctabid-8%2Ctabid-update-proj-http%2Ctabid-reset-http%2Ctabid-read-stream-http%2Ctabid-update-proj-config-http%2Ctabid-read-projection-events-renamed-http%2Ctabid-enablebycategory-http%2Ctabid-projections-count-per-stream-http%2Ctabid-read-partition-http#writing-your-first-projection) to create a projection.

### Count all events

The first projection counts all the unique events in the `quiz` stream. Add the code below into the text area, give it an appropriate name, and click _Save_:

```javascript
fromStream('quiz')
.when({
    $init: function(){
        return {
            count: 0
        };
    },
    $any: function(s,e){
        s.count += 1;
    }
}).outputState();
```

![Create projection](/images/count-quiz-entries-proj.png)

A Projection starts with a selector, in this case `fromStream('quiz')`, which pulls events from the specified stream. Find more details on projections selector options [in the documentation](/docs/projections/user-defined-projections/index.html#selectors).

The second part of a projection is a set of filters, in this case a `.when` [filter](/docs/projections/user-defined-projections/index.html#filterstransformations) that matches the filter parameters you define within the filter.

Inside the filter are [handlers](/docs/projections/user-defined-projections/index.html#handlers). In this case, `$init` that sets up an initial state, which is a counter from 0, and the `$any` handler that increments the counter each time Event Store observes any event.

Finally, the `outputState()` filter outputs the state to a stream method, which by default produces a `$projections-{projection-name}-result` stream.

![Projection result](/images/count-quiz-result.png)

### Count all occurrences of a specific event type

The next projection counts all occurrences of a particular event type, for example `PlayerHasRegistered`, indicating that a new player has registered to take part in the quiz.

```javascript
fromStream('quiz')
.when({
    $init: function(){
        return {
            count: 0
        };
    },
    PlayerHasRegistered: function(s,e){
        s.count += 1;
    }
}).outputState();
```

![Create projection](/images/player-reg-proj.png)

The only difference in this code example is that we changed the `$any` handler to match that of the event type we are looking for.

Create, save, and run this projection.

![Projection result](/images/player-reg-result.png)
