---
layout: blog-post
title: "Guest post: Subscription service for Event Store"
seo-title: "Subscription service for Event Store"
author: "Steven Blair"
description: "VME Retail have released version 1.0.0 of their Subscription Service, which is intended to make life that little bit easier for delivering events from Event Store to clients. The Subscription Service has been used privately by VME Retail Ltd for a few years in various solutions, and they have decided to open the code up to the rest of the Event Store community."
category: "Articles"
tags: ["Event Store","Guest article"]
---
> **This is a guest article** - Steven Blair is a Software Architect at VME Retail Ltd.

## Introduction

We have released version 1.0.0 of the Subscription Service, which is intended to make life that little bit easier for delivering events from Event Store to clients.

The Subscription Service has been used privately by VME Retail Ltd for a few years in various solutions, and we decided to open the code up to the rest of the Event Store community.

![Subscription Service for Event Store](/images/subscription-service-vme-retail.png)

## What does the Subscription Service do?

The Subscription Service is a light weight library intended to simplify creating and delivering events from Event Store to various endpoints.

For example, if you have a requirement to deliver all events from a category to a third-party client, you could do this:

```
List<Subscription> subscriptions = new List<Subscription>();
subscriptions.Add(Subscription.Create("$ce-Accounts", "Read Model", new Uri("http://externalclient.com/api/events")));
SubscriptionService subscriptionService = new SubscriptionService(subscriptions, eventStoreConnection);
await subscriptionService.Start(CancellationToken.None);
```

The Subscription Service will connect (and create where applicable) the persistent subscription and deliver all the events on this stream to configured endpoint.

## Business case for the subscription service

If an Event Store is central to your system, there is a good chance you have a requirement to deliver events from here to other systems.

Examples of this might be:
1. Read Model
2. Other Bounded Contexts (for eventual consistency)
2. External systems out with your control

The Subscription Service sits in between your Event Store and endpoints, and manages the delivery of these events.

This allows you to create routes for each stream (along with various configuration values).

One scenario we use at VME Retail is having a Subscription Service configured to deliver events to external systems. This means we can turn off delivery of these events by stopping the service, while continuing to consume events from other Subscription Services.

## Technical details

For anyone interested in the technical details of the Subscription Service, here is a quick overview:

1. Service will create Persistent Subscription if it doesn’t already exist
2. Service will manage acking / naking of posted events.
3. User can easily override default http settings to customise posting (for example, if you need to include an Authorisation Token in your POST)

## Additional information

The Subscription Service GitHub repository can be found [here](https://github.com/vmeretail/subscriptionservice "Subscription Service on Github")

Nuget package can be downloaded [here](https://www.nuget.org/packages/EventStore.SubscriptionService "Subscription Service on Nuget")
