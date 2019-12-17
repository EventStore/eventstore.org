---
title: "Getting Started: Part 1 – Introduction"
date: 2013-02-20T17:55Z
author: "James Nugent"
layout: blog-post
category: "Tutorials"
tags: ["Event Store","Event sourcing"]
---

Two of the most common requests we've had is for more documentation for people getting started using the Event Store for event sourced applications. Another is how to hook up read models in the absence of a “dispatcher” concept as appears in Jon Oliver’s Event Store project (JOES from here in!), and a third is how to import events.

This short series of posts aims to address these questions. A likely structure is:

- Part 1 - Introduction
- Part 2 - Implementing the CommonDomain Repository interface
- Part 3 - Hooking up read models using a durable subscriber
- Part 4 - Importing events saved in JOES (the easy way)
- Part 5 - Importing events saved in JOES (the hard way)
- Part 6 onwards - whatever people ask for!

When we come to looking at importing events from JOES, we’ll look at some of the differences between the two implementations of an Event Store, and how you can re-serialize your events using the idioms of Event Store in order to be able to take advantage of some of the projections features.

If anyone has any suggestions for other parts we could cover, please let us know either in the comments, on Twitter, or by email!