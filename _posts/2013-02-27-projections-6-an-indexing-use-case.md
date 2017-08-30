---
title: "Projections 6: An indexing use case"
date: 2013-02-27T14:22Z
author: "Greg Young"
layout: blog-post
---

As we went through in [Projections 5 : Indexing](/blog/20130218/projections-5-indexing), the `linkTo()` function is capable of emitting pointers to another stream. This can allow you to break apart streams in order to change their partitioning and to allow fast indexing. In this post we will look at a use case of how you can use this functionality.

I have seen no less than 10 custom auditing systems for nservicebus. Everyone seems to want to build out their own custom auditing system. Most involve writing out the messages to a database table then querying off the database table to show results for say a given correlationid or a certain user. Projections and the Event Store can handle this workload quite easily with two small indexing projections.

Let’s assume we have hooked the audit queue in nservicebus and we are writing into the Event Store all the messages. When writing we write metadata containing the correlationId and the username.

``` javascript
{
    correlationId : "guid",
    username : "greg"
}
```

We would then write our two indexing projections (correlationid and username).

``` javascript
fromAll().when({$any : function(s,e) { linkTo(e.metadata.correlationId, e); }}})
```

``` javascript
fromAll().when({$any : function(s,e) { linkTo(e.metadata.username, e); }}})
```

This will create a stream for every correlationId and a stream for every username. Once those are run you would then just go to `http://node:port/streams/greg` and you would see all the messages I am doing in the system (the UI even updates on its own as I am watching it). This is a very common and simple usage. It should also be noted that while here I am basically promoting a piece of metadata, the code is in JavaScript and you could do pretty much anything there (maybe the modulus of the combined string of four properties of the to 42?).