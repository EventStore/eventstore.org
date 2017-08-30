---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Stream Metadata"
section: ".NET API"
version: "3.1.0"
---

Every stream in the Event Store has metadata associated with it. Internally, the metadata includes information such as the ACL of the stream and the maximum count and age for the events in the stream. Client code can also put information into stream metadata for use with projections or through the client API.

A common use case of information you may want to store in metadata is information associated with an event that is not part of the event. An example of this might be which user wrote the event? Which application server were they talking to? From what IP address did the request come from? This type of information is not part of the actual event but is metadata assocatiated with the event.

Stream metadata is stored internally as JSON, and can be accessed over the HTTP APIs.

## Methods

### Reading Stream Metadata
```csharp
Task<StreamMetadataResult> GetStreamMetadataAsync(string stream, UserCredentials userCredentials = null)
```

```csharp
Task<RawStreamMetadataResult> GetStreamMetadataAsRawBytesAsync(string stream, UserCredentials userCredentials = null)
```

### Writing Stream Metadata
```csharp
Task<WriteResult> SetStreamMetadataAsync(string stream, int expectedMetastreamVersion, StreamMetadata metadata, UserCredentials userCredentials = null)
```

```csharp
Task<WriteResult> SetStreamMetadataAsync(string stream, int expectedMetastreamVersion, byte[] metadata, UserCredentials userCredentials = null)
```

## Reading Stream Metadata

To read stream metadata over the .NET API you can use methods found on the EventStoreConnection. The GetStreamMetadata methods have two mechanisms of being used. The first is to return you a fluent interface over the stream metadata, the second (GetStreamMetadataRaw) is to return you the raw JSON of the stream metadata.

```csharp
Task<StreamMetadataResult> GetStreamMetadataAsync(string stream, UserCredentials userCredentials = null)
```

This will return a StreamMetadataResult. The fields on this result are:

<table>
    <thead>
        <tr>
            <th>Member</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string Stream</code></td>
            <td>The name of the stream</td>
        </tr>
        <tr>
            <td><code>bool IsStreamDeleted</code></td>
            <td>True is the stream is deleted, false otherwise.</td>
        </tr>
        <tr>
            <td><code>int MetastreamVersion</code></td>
            <td>The version of the metastream format</td>
        </tr>
        <tr>
            <td><code>StreamMetadata Metadata</code></td>
            <td>A StreamMetadata object representing the metadata JSON</td>
        </tr>
    </tbody>
</table>

You can then access the StreamMetadata via the StreamMetadata object. It contains typed fields for well known stream metadata entries.

<table>
    <thead>
        <tr>
            <th>Member</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>int? MaxAge</code></td>
            <td>The maximum age of events in the stream. Items older than this will be automatically removed.</td>
        </tr>
        <tr>
            <td><code>int? MaxCount</code></td>
            <td>The maximum count of events in the stream. When you have more than count the oldest will be removed.</td>
        </tr>
        <tr>
            <td><code>int? TruncateBefore</code></td>
            <td>When set says that items prior to event E can be truncated and will be removed.</td>
        </tr>
        <tr>
            <td><code>TimeSpan? CacheControl</code></td>
            <td>The head of a feed in the atom api is not cacheable. This allows you to specify a period of time you want it to be cacheable. Normally low numbers are best here (say 30-60 seconds) and introducing values here will introduce latency over the atom protocol if caching is occuring.</td>
        </tr>
        <tr>
            <td><code>StreamAcl Acl</code></td>
            <td>The access control list for this stream.</td>
        </tr>
    </tbody>
</table>

If instead you want to work with raw JSON you can use the Raw methods for stream metadata.

```csharp
Task<RawStreamMetadataResult> GetStreamMetadataAsRawBytesAsync(string stream, UserCredentials userCredentials = null)
```
This will return a RawStreamMetadataResult. The fields on this result are:


<table>
    <thead>
        <tr>
            <th>Member</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>string Stream</code></td>
            <td>The name of the stream</td>
        </tr>
        <tr>
            <td><code>bool IsStreamDeleted</code></td>
            <td>True is the stream is deleted, false otherwise.</td>
        </tr>
        <tr>
            <td><code>int MetastreamVersion</code></td>
            <td>The version of the metastream (see <a href="../optimistic-concurrency-and-idempotence">Expected Version</a>)</td>
        </tr>
        <tr>
            <td><code>byte[] Metadata</code></td>
            <td>The raw data of the metadata JSON</td>
        </tr>
    </tbody>
</table>

<span class="note">
Reading metadata may require that you pass credentials if you have security enabled by default it is only allowed for admins though this can be changed via default acls. If you do not pass credentials and they are required you will receive an AccessedDeniedException.
</span>


## Writing Metadata

Writing metadata can also be done in both a typed and a raw mechanism. When writing it is generally easier to use the typed mechanism. Both writing mechanisms also support an expectedVersion which works the same as on any stream and can be used to control concurrency see [Expected Version](../optimistic-concurrency-and-idempotence) for further details.

```csharp
Task<WriteResult> SetStreamMetadataAsync(string stream, int expectedMetastreamVersion, StreamMetadata metadata, UserCredentials userCredentials = null)
```

The StreamMetadata being passed here has a builder that can be accessed via StreamMetadata.Create(). The options available on the builder are:

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>SetMaxCount(int count)</code></td>
            <td>Sets the maximum count of events in the stream.</td>
        </tr>
        <tr>
            <td><code>SetMaxAge(TimeSpan age)</code></td>
            <td>Sets the maximum age of events in the stream.</td>
        </tr>
        <tr>
            <td><code>SetTruncateBefore(int seq)</code></td>
            <td>Sets the event number from which previous events can be scavenged.<</td>
        </tr>
        <tr>
            <td><code>SetCacheControl(TimeSpan cacheControl)</code></td>
            <td>The amount of time for which the stream head is cachable.</td>
        </tr>
        <tr>
            <td><code>SetReadRoles(string[] roles)</code></td>
            <td>Sets the roles that are allowed to read the underlying stream.</td>
        </tr>
        <tr>
            <td><code>SetWriteRoles(string[] roles)</code></td>
            <td>Sets the roles that are allowed to write to the underlying stream.</td>
        </tr>
        <tr>
            <td><code>SetDeleteRoles(string[] roles)</code></td>
            <td>Sets the roles that are allowed to delete the underlying stream.</td>
        </tr>
        <tr>
            <td><code>SetMetadataReadRoles(string[] roles)</code></td>
            <td>Sets the roles that are allowed to read the metadata stream.</td>
        </tr>
        <tr>
            <td><code>SetMetadataWriteRoles(string[] roles)</code></td>
            <td>Sets the roles that are allowed to write the metadata stream. Be careful with this privilege as it essentially gives all of the privileges for a stream as that use can assign themselves any other privilege.</td>
        </tr>
        <tr>
            <td><code>SetCustomMetadata(string key, string value)</code></td>
            <td>The SetCustomMetadata method and overloads allow the setting of arbitrary custom fields into the stream metadata.</td>
        </tr>
    </tbody>
</table>

User-specified metadata can also be added here via the SetCustomMetadata overloads. Some examples of good uses of user-specified metadata:

- which adapter is responsible for populating a stream
- which projection caused a stream to be created
- a correlation ID of some business process
- plenty more!

```csharp
Task<WriteResult> SetStreamMetadataAsync(string stream, int expectedMetastreamVersion, byte[] metadata, UserCredentials userCredentials = null)
```

This method will just put the data that is in metadata as the stream metadata. metadata in this case can be anything in a vector of bytes however the server itself only understands JSON. Please see [Access Control Lists]({{ site.url }}/server/latest/access-control-lists) for more information on the format in JSON for access control lists.

<span class="note">
Writing metadata may require that you pass credentials if you have security enabled by default it is only allowed for admins though this can be changed via default acls. If you do not pass credentials and they are required you will receive an AccessedDeniedException.
</span>
