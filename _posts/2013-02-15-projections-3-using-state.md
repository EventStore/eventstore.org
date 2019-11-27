---
title: "Projections 3: Using state"
date: 2013-02-15T08:50Z
author: "Greg Young"
layout: blog-post
category: 'Tutorials'
---

In [Projections 2](/blog/20130213/projections-2-a-simple-sep-projection) we looked at creating a very simple projection that would analyze our statistics inside of the Event Store. The projection was:

```javascript
fromStream('$stats-127.0.0.1:2113').
    when({
        "$statsCollected" : function(s,e) {
              var currentCpu = e.body["sys-cpu"];
              if(currentCpu > 40) {
                   emit("heavycpu", "heavyCpuFound", {"level" : currentCpu})
              }
         }
    });
```

This is a very common type of scenario we will find in event based systems. We can describe this as:

“When this event happens and this information is on the event, trigger a new event to a different stream.”

Very often however its not just one event that will cause something to trigger. This is why the state variable exists. Very often we want to handle a question that is more akin to:

“When this event happens, then this event happens, then this event happens trigger an event to a different stream.”

Let's try to change our problem from *Projections 2* into one like this. I am only interested in `highcpu` scenarios where the CPU is over 40% for more that 3 samplings in a row. A single one could just be a fluke that happened. In order to do this type of query we will have to use our state variable to tie together multiple function calls.

```javascript
fromStream('$stats-127.0.0.1:2113').
    when({
        "$statsCollected" : function(s,e) {
              var currentCpu = e.body["sys-cpu"];
              if(currentCpu > 40) {
                   if(!s.count) s.count = 0;
                   s.count += 1;
                   if(s.count >= 3)
                        emit("heavycpu", "heavyCpuFound", {"level" : currentCpu,
                                                           "count" : s.count});
              }
              else
                   s.count = 0;
         }
    });
```

Note: if you are trying this at home you may want to change how often statistics are sampled. You can set this with `--stats-period-sec=SECONDS`.

Now we use our state that gets passed from call to call to correlate multiple events together. If we get three or more samples with a CPU usage greater than 40% in a row then we will produce a message to the `heavycpu` stream that looks like:

```javascript
{
  "eventStreamId": "heavycpu",
  "eventNumber": 3,
  "eventType": "heavyCpuFound",
  "data": {
    "level": 41.896265,
    "count": 6
  },
  "metadata": {
    "streams": {
      "$stats-127.0.0.1:2113": 8
    }
  }
}
```

This is a very powerful paradigm as the state variable allows me to bring state from one call to the next allowing me to correlate multiple events together. Another example of this might be I am looking for users on Twitter that said the word “coffee” and “happy” within 5 minutes of mentioning “starbucks”. This query would be implemented in the same one as the one we just tried.

As food for thought. Could I now write another projection off of `heavycpu` that then looked for items with 5 measurements > 80 and counts > 10? You wouldn’t probably do this in practice as you could put that logic in the first projection but you can compose projections as well!

In our next post we will look at having multiple types of events.