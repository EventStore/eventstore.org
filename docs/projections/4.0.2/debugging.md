---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Debugging"
section: "Projections"
version: "4.0.2"
pinned: true
---

User projections written in javascript comes with a benefit that debugging is made really easy via any browser that ships with debugging capabilities. The following screenshots show the use of Chrome, but debugging has been tested with all major browsers which includes Firefox, Microsoft Edge and Safari.

## Logging from within a Projection

For debugging purposes, projections includes a log method which will, when called, will send messages to the configured Event Store logger (default NLog and to a file as well as stdout).

Something that proves to be quite useful is printing out the structure of the event body for inspection.

For example:

```javascript
fromStream('$stats-127.0.0.1:2113')
.when({
    $any: function(s,e){
        log(JSON.stringify(e));
    }
})
```

## Starting and Configuring Event Store for Projections

The following configuration supplied, starts Event Store with all the projection modes enabled (User Defined as well as System) and uses an in memory database which is suitable for development purposes.

```bash
EventStore.ClusterNode.exe --run-projections=all --mem-db
```

## Creating a sample projection for debugging purposes

Filename: `stats-counter.json`

Contents:

```javascript
fromStream('$stats-127.0.0.1:2113')
.when({
    $init: function(){
        return {
            count: 0
        }
    },
    $any: function(s,e){
        s.count += 1;
    }
})
```

We can create the projection by making a call to the API and provide it with the definition of the projection.

```bash
curl -i -d@stats-counter.json http://localhost:2113/projections/continuous?name=stats-counter%26type=js%26enabled=true%26emit=true%26trackemittedstreams=true -u admin:changeit
```

## Debugging your first projection

Once the projection is running, it's time to turn to your browser and enable the developer tools. Once you have the developer tools open, navigating over to your projection should provide you with a button labelled "Debug".

![Projections Debugging Part 1](/images/projections_debugging_part_1.png)

After hitting the projection "Debug" button, you will be navigated to the debugging interface where the definition of the projection is provided along with information about the Events that are being processed by the projection on the right hand side.

At the top there are couple of buttons to take note of, more specifically the `Run Step` and `Update` buttons. `Run Step` is used for stepping through the event waiting in the queue to be processed by the projection, essentially placing you in projection debugging mode. The `Update` button provides you with a way to update the projection definition without having to go back to the Projection itself and leave the context of the debugger.

![Projections Debugging Part 2](/images/projections_debugging_part_2.png)

If the `Run Step` button is not greyed out, if you click it, you will see that a breakpoint has been hit in your browser.

![Projections Debugging Part 3](/images/projections_debugging_part_3.png)

You are now able to step through the projection, the important method to step into so that you can debug your projection is to step into the handler(state, eventEnvelope) method.
