---
title: "Projections 7: Multiple Streams"
date: 2013-03-09T12:00Z
author: "Greg Young"
layout: blog-post
---

Up until this point we have only used two event selection methods for our projections. We have used `fromStream(‘stream’)` which will select all of the events in a stream and we have used `fromAll()` which selects all events in the system. There is another quite useful selection that will move us from SEP (Simple Event Processing) to CEP (Complex Event Processing). This is the ability to select between multiple streams.

To select from multiple streams we use `fromStreams(['stream1', 'stream2', 'stream3'])` what this will do is bring together the events from multiple streams. This can also be called a Join operation. `fromStreams(['stream1', 'stream2', 'stream3'])` will take the three streams (stream1, stream2, stream3) and produce a single output stream containing events from all three that the projection will be run against.

This operation while seemingly simple is actually quite difficult. Generally the partition point of the system is streams. If you are running in a single node group (not partitioned, either the replicated group or single node) then this projection will have assurances that the events will come in perfect order (even when being processed in real time). But what happens if this is distributed?

You can imagine stream1 lives on one machine and stream2 lives on another machine. This could cause problems with ordering due to situations where the machines are partitioned from each other. Luckily projections allows you to solve this problem with some options that you can set. In particular you can add options

```
options({
reorderEvents: true,
processingLag: 500 //time in ms
});
```

This will tell projections to introduce a delay to allow for the reordering of events from different partitions. This allows a much better handling for `fromStreams` in a distributed scenario. A buffer of `processingLag` milliseconds will be introduced to allow for the reordering of events before they are run through the projection.