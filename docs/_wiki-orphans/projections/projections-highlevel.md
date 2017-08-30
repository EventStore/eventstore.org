Projections are the query language that is built into the Event Store. This document is an overview about the query language including describing the types of problems that they can be very useful for. For more specific discussions about the various operations please see [here](todo add link)

The query language in the Event Store is implemented in JavaScript. Internally the v8 engine is hosted for the running of these queries. Those familiar with Complex Event Processing (CEP) concepts or the new stream api in java8 should find the language reasonably approachble. One of the main differences between CEP and the projections library is that projections are used for querying history in a CEP style. There is also a difference in that instead of bringing the events to the processor, the processor is brought to the events.

###Where to Use Projections

There are many problems that the projections query language is not good at solving. Most people having a hard time with projections are trying to apply them to a problem that they are not well suited towards solving. Examples of problems that projections are not good at solving:
* Creating a customer view that can then be searched
* Finding how two users on twitter are connected
* Doing a rollup query based on city/country

For any of these types of queries you will be better off using a [Catchup Subscription](wiki/Subscriptions-%24.NET-API%25) and having it write into another database such as a document, graph, or relational database.

Projections are very good however at solving one specific type of query. This type of query happens more often than you may think in business systems and very few systems can execute these queries well. The queries fall into a category known as temporal correlation queries.

###Business Cases###

I am looking for how users on twitter said "happy" within 5 minutes of the word "foo coffee shop" and within 2 minutes of saying "london".

While a simple and frankly stupid case this is the type of query that projections can solve simply and cleanly. Let's try a real business problem.

As a medical research doctor I want to find people that were diagnosed with pancreatic cancer within the last year. During their treatment they should not have had any proxies for a heart condition such as aspirin given every morning. Within three weeks of their diagnosis they should have been put on treatment X. Within one month after starting the treatment they should have failed with a lab result that looks like L1. Within another six weeks they should have been been put on treatment Y and within four weeks failed that treatment with a lab result that looks like L2.

This is a common type of query that exists in many industries and is the exact case that projections work very well as a query model for.

Projections can also be used in nearly all examples of near-real time Complex Event Processing. There are a huge number of problems that fit into this category from monitoring of temperature sensors in a data center to reacting to changes in the stock market.

It is important to remember the types of problems that projections are intended to solve. Many problems are not a good fit with the projections library and will be better served by hosting another read model that is populated by a  [Catchup Subscription](wiki/Subscriptions-%24.NET-API%25)

###Continuous Querying###

Projections also support the concept of continuous queries. When running a projection you can choose whether the query should run and give you all results currently present or whether the query should continue running into the future finding new results as they happen and updating its result set.

As an example in the medical example above the doctor could leave his query running and be notified of any new patients that happened to meet the criteria that he was searching for. The output of all queries is a stream, this stream can then be listened to like any other stream.

![Google analytics pixel](https://gaproxy-1.apphb.com/UA-40176181-1/Wiki/ProjectionsHighLevel)
