---
title: "Projections (intermission)"
date: 2013-02-17T08:37Z
author: "Greg Young"
layout: blog-post
category: "Tutorials"
tags: ["Event Store","Projections","Event sourcing"]
---

Yesterday I was meeting with a company. We were going through some of their problems and looking at whether the Event Store and in particular stream querying might be a viable solution to any of their problems. It turned out one of the problems was a perfect example of where projections can make a big project tiny.

## The Problem

People put “Bid Strategies” in through a web application. These strategies are then used for blind live bidding of prices of some commodity. Sometimes a bid is won. When a bid is won, sometimes “something good” happens later. Users want real-time feedback to their web browser on the bidding process as they are changing it. Thousands of bids happen per second.

This is a very stereotypical problem in many systems. There is some process that’s happening very quickly and we want to summarize that process and give real time feedback to a user. This is a typical example of where projections can really shine.

## The Solution

Let’s start by defining the events that will be happening in this system:

- `StrategyStarted { strategyId }`
- `StrategyEnded { strategyId }`
- `BidPlace {bidId } //probably some bid information as well`
- `BidWon {bidId }`
- `SomethingGoodHappenned {bidId}`
- `IntervalOccured {time}`

We will integrate with the current system by writing these events into the event store. There will be a stream for each strategy. As they are not interested in a long period of time we will also set `$maxAge` on the streams to one day (all data older than one day can be deleted).

Now we have the data coming into the event store. It can easily handle a few thousand transaction per second. But how do we get summarized real time data out to the user? This is where projections can come into play. This projection will use a lot that is not yet discussed in the projections series. Don’t let that scare you we will explain what its doing.

```javascript
fromCategory('strategy').
    foreachStream().
    when( {
                $init : function() {
                              return {
                                   "id" : 0,
                               "bidsPlaced" : 0,
                               "bidsWon" : 0,
                               "goodthings" : 0
                                   }
                       },
                StrategyStarted : function(s,e) { s.id = e.body.strategyid},
                BidPlaced : function(s,e) { s.bidsPlace += 1; },
                BidWon : function(s,e) { s.bidsWon += 1; },
                SomethingGoodHappenned : function(s,e) {
                                         s.goodthings++;
                                         linkTo('goodthings-' + s.id, e);
                                      },

                IntervalOccurred : function(s,e) {
                                          emit('liveresults-' + s.id,
                                                        {
                                                                "strategyid" : s.id,
                                                    "goodthings" : s.goodthings,
                                                    "bidsPlaced" : s.bidsPlaced,
                                                    "bidsWon" : s.bidsWon,
                                                    "time" : e.time
                                                         });
                                           s.bidsPlaced = 0;
                                           s.bidsWon = 0;
                                           s.goodthings = 0;
                                      }
             });
```

Wow now that’s a little more complicated than the other projections we have been looking at! Let’s get into a bit of what it does.

`fromCategory() ->` this selects all streams that are in a category `foreachStream() ->` this says to run this on all streams in the category (in parallel!)

The `when()` is basically what we have looked at before but we have now said we want it to run independently against every strategy stream in the system (each has their own state variable). It is then calculating the counts of bids/bidswon/goodthings that happen within the interval of time which is overall pretty basic logic.

At the end of the interval it puts a new message out to `liveresults-{strategy}` with the results from the interval. For good measure it also puts out all “good things” to a separate stream as links. Basically the whole backend of the system is done now. It will scale, is highly available, and fully durable.

## Connecting the client

To hook up a client to this we just need to access the streams and update the UI for the user somehow. Luckily there is an easy way to do this. Every stream is an atom feed. Instead of coming up with some super fancy custom way to get to the client. We can just use something like jFeed. The client is now receiving all the events via JavaScript and will just need to draw the results on the screen. How long does it take to draw pretty results? Well thats up to the person doing it.

## Summary

As you can see projections can be very useful in certain categories of problems. In using them here a highly available scalable system processing thousands of messages/second can be built and put into production in less than an afternoon using nothing but JavaScript.