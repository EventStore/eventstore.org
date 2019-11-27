---
title: "Projections 4: Event matching"
date: 2013-02-18T00:38Z
author: "Greg Young"
layout: blog-post
category: 'Tutorials'
---

In the [“intermission” post](/blog/20130217/projections-intermission) we jumped ahead quite a bit in terms of the complexity of the projection we were building. Let’s jump back into our progression of learning bits.

The projections we have used so far have used a method called `when()`. This method allows you to match functions back to types of events. Up until now that has been a single match but you can also use more than one.

```javascript
fromStream('test').when({
                           Event1: f1,
                           Event2: f2
                        });
```

This defines that every time an event of type `Event1` is seen the function `f1` should be called with that event and function `f2` for events of type `Event2`. This is a very useful construct when trying to build out projections that require the ability to handle many different types of events.

There are also some special matches defined.

`$any` will match all events to your function. This is useful for example when you want to build an index for all events. We will get into how this works later but you can imagine if I wanted to build an index based upon the user that created the event (stream per user) then the function would want to look at all events in the system.

*It is important to remember that as of now `$any` cannot be under in conjunction with other filters.*

`$init` gets called before any other handler. The job of `$init` is to return the initial state that will be passed to the rest of your functions. In the intermission post this handler was used to set up initial state so the other handlers did not have to. The usage can also be seen in looking at the post from the [Projections 3](/blog/20130215/projections-3-using-state).

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

In this projection the line `if(!s.count) s.count = 0` is being used to initialize the state if its the first time into the function. This could also be implemented as:

```javascript
fromStream('$stats-127.0.0.1:2113').
    when({
        "$init" : function(s,e) { return {"count":0},
        "$statsCollected" : function(s,e) {
              var currentCpu = e.body["sys-cpu"];
              if(currentCpu > 40) {
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

The two will work in the same way. In our next post we will start looking at how indexing works in the event store.