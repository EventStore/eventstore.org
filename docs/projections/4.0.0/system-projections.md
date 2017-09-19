---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "System Projections"
section: "Projections"
version: "4.0.0"
pinned: true
---

Event Store ships with 4 built in projections.

- By Category ($by_category)
- By Event Type ($by_event_type)
- Stream by Category ($stream_by_category)
- Streams ($streams)

<span class="note">
When you start Event Store from a fresh database, these projections are present but disabled and querying their statuses you will see that they are `Stopped`. You can enable a projection by issuing an HTTP request to `http://{event-store-ip}:{ext-http-port}/projection/{projection-name}/command/enable`. The status of the projection will switch from `Stopped` to `Running`.
</span>

## By Category

This projection links existing events from streams to a new stream with a `$ce-` prefix (a category) by splitting a stream id by a configurable separator.

*$by_category*

```
first
-
```

By default the `$by_category` projection will link existing events from a stream id with a name such as `account-1` to a stream called `$ce-account`.
The separator as well as where to split the stream id is configurable. You can edit the projection and provide your own values if the defaults don’t fit your particular scenario.

The first parameter specifies how the separator will be used and the possible values for that parameter is first or last. The separator can be any character.

For example:

If the body of the projection is first and -, for a stream id of `account-1`, the resulting stream name from the projection will be `$ce-account`.

If the body of the projection is last and -, for a stream id of `shopping-cart-1`, the resulting stream name from the projection will be `$ce-shopping-cart`.

<span class="note">
This particular projection enables the use of the `byCategory` selector for user defined projections which will be discussed in the `User defined projections` section.
</span>

## By Event Type
This projection links existing events from streams to a new stream with a stream id in the format `$et-{event-type}`.

*$by_event_type*

This projection cannot be configured.

## Stream By Category
This projection links existing events from streams to a new stream with a `$category` prefix by splitting a stream id by a configurable separator.

*$stream_by_category*

```
first
-
```

By default the `$stream_by_category` projection will link existing events from a stream id with a name such as `account-1` to a stream called `$category-account`.
The separator as well as where to split the stream id is configurable. You can edit the projection and provide your own values if the defaults don’t fit your particular scenario.

The first parameter specifies how the separator will be used and the possible values for that parameter is first or last. The separator can be any character.

For example:

If the body of the projection is first and -, for a stream id of `account-1`, the resulting stream name from the projection will be `$category-account`.

If the body of the projection is last and -, for a stream id of `shopping-cart-1`, the resulting stream name from the projection will be `$category-shopping-cart`.

## Streams
This projection links existing events from streams to a stream named `$streams`

*$streams*

This projection cannot be configured.
