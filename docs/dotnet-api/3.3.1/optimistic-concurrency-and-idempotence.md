---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Optimistic Concurrency & Idempotence"
section: ".NET API"
version: "3.3.1"
---

Writing supports an optimistic concurrency check on the version of the stream to which events are to be written. The method of specifying what the expected version is depends whether writes are being made using the HTTP or .NET API.

In the .NET API, there are a number of constants which should be used to represent certain conditions:

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>ExpectedVersion.Any</code></td>
            <td>This disables the optimistic concurrency check.</td>
        </tr>
        <tr>
            <td><code>ExpectedVersion.NoStream</code></td>
            <td>this specifies the expectation that target stream does not yet exist.</td>
        </tr>
        <tr>
            <td><code>ExpectedVersion.EmptyStream</code></td>
            <td>this specifies the expectation that the target stream has been explicitly created, but does not yet have any user events written in it.</td>
        </tr>
        <tr>
            <td><code>Any other integer value</code></td>
            <td>The event number that you expect the stream to currently be at.</td>
        </tr>
    </tbody>
</table>

If the optimistic concurrency check fails during writing, a `WrongExpectedVersionException` will be thrown.

## Idempotence

If identical write operations are performed, they will be treated in a way which makes it idempotent. If a write is treated in this manner, it will be acknowledged as successful, but duplicate events will not be written. The idempotence check is based on the `EventId` and `stream`. It is possible to reuse an `EventId` across streams whilst maintaining idempotence.

The level of idempotence guarantee depends on whether or not the optimistic concurrency check is not disabled during writing (by passing `ExpectedVersion.Any` as the `expectedVersion` for the write).

### If an expected version is specified

The specified `expectedVersion` is compared to the `currentVersion` of the stream. This will yield one of three results:

- **`expectedVersion > currentVersion`** - a `WrongExpectedVersionException` will be thrown.

- **`expectedVersion == currentVersion`** - events will be written and acknowledged.

- **`expectedVersion < currentVersion`** - the `EventId` of each event in the stream starting from `expectedVersion` are compared to those in the write operation. This can yield one of three further results:

	- **All events have been committed already** - the write will be acknowledged as successful, but no duplicate events will be written.
	 
	- **None of the events were previously committed** - a `WrongExpectedVersionException` will be thrown.
	
	- **Some of the events were previously committed** - this is considered a bad request. If the write contains the same events as a previous request, either all or none of the events should have been previously committed. This currently surfaces as a `WrongExpectedVersionException`.

### If `ExpectedVersion.Any` is specified

*Idempotence is __not__ guaranteed if `ExpectedVersion.Any` is used. The chance of a duplicate event being written is small, but it does exist.*

The idempotence check will yield one of three results:

- **All events have been committed already** - the write will be acknowledged as successful, but no duplicate events will be written.
 
- **None of the events were previously committed** - the events will be written and the write will be acknowledged.

- **Some of the events were previously committed** - this is considered a bad request. If the write contains the same events as a previous request, either all or none of the events should have been previously committed. This currently surfaces as a `WrongExpectedVersionException`.