---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Embedded Client"
section: ".NET API"
version: "3.9.0"
---

## EmbeddedVNodeBuilder

The `EmbeddedVNodeBuilder` class is responsible for setting up and building an Event Store node. You can configure your node through a number of methods provided by `EmbeddedVNodeBuilder`. 

<span class="note">
The builder that is used for the `EmbeddedVNodeBuilder` is the same as the one we use internally to create the `ClusterNode`, so check `EventStore.ClusterNode.Program.cs` for more examples of how to use it.
</span>

## Building a node

You have two options when you start creating a node: `EmbeddedVNodeBuilder.AsSingleNode()` or `EmbeddedVNodeBuilder.AsClusterMember(clusterSize)`, which will create a single node or a cluster node respectively. After creating the builder, you can configure the node through the methods provided by the `EmbeddedVNodeBuilder`. These will be listed further down.

Once you have configured the node, build it with `EmbeddedVNodeBuilder.Build()` which will return the configured `ClusterVNode`.

Start the node with `ClusterVNode.StartAndWaitUntilReady()` or `ClusterVNode.Start()`.
`ClusterVNode.StartAndWaitUntilReady()` returns a task that will complete once the node has started up and all subsystems have finished loading.

For example, to build a single node with default options :

```csharp
var nodeBuilder = EmbeddedVNodeBuilder.AsSingleNode()
                                      .OnDefaultEndpoints()
                                      .RunInMemory();
var node = nodeBuilder.Build();
node.StartAndWaitUntilReady().Wait();
```

To build a node to be part of a cluster with custom endpoints and gossip seeds :

```csharp
var nodeBuilder = EmbeddedVNodeBuilder.AsClusterMember(3)
                      .RunOnDisk("node1db")
                      .WithInternalHttpOn(new IPEndPoint(IPAddress.Loopback, 1112))
                      .WithExternalHttpOn(new IPEndPoint(IPAddress.Loopback, 1113))
                      .WithExternalTcpOn(new IPEndPoint(IPAddress.Loopback, 1114))
                      .WithInternalTcpOn(new IPEndPoint(IPAddress.Loopback, 1115))
                      .DisableDnsDiscovery()
                      .WithGossipSeeds(new IPEndPoint[]
                      {
                          new IPEndPoint(IPAddress.Loopback, 2112),
                          new IPEndPoint(IPAddress.Loopback, 3112)
                      });
var node = nodeBuilder.Build();
node.Start();
```

<span class="note--warning">
When running an embedded cluster, the task returned by `StartAndWaitUntilReady()` will only complete on the master node.
</span>

## Connecting to an embedded node

You can connect to an embedded Event Store node with the `EmbeddedEventStoreConnection` class.
Calling `EmbeddedEventStoreConnection.Create(ClusterVNode)` will return an `IEventStoreConnection` configured to connect to your embedded node. From there you can use the connection as you normally would in the .NET Client.

```csharp
using(var embeddedConn = EmbeddedEventStoreConnection.Create(node))
{
    embeddedConn.ConnectAsync().Wait();
    embeddedConn.AppendToStreamAsync("testStream", ExpectedVersion.Any, 
                    new EventData(Guid.NewGuid(), "eventType", true, 
                    Encoding.UTF8.GetBytes("{\"Foo\":\"Bar\"}"), null)).Wait();
}
```

## Logging with an embedded node

In order to enable logging for an embedded node, you need to initialise the LogManager and ensure that you configure the logger with a `log.config` file in your configuration directory.

To initialise the LogManager, call this before building the nodes :

```csharp
LogManager.Init(logComponentName, logDirectory, logConfigurationDirectory);
```

## EmbeddedVNodeBuilder options

The following options are available when building an Embedded Node

### Application Options

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>AsSingleNode()</code></td>
            <td>Returns a builder set to construct options for a single node instance</td>
        </tr>
        <tr>
            <td><code>AsClusterMember(int clusterSize)</code></td>
            <td>Returns a builder set to construct options for a cluster node instance with a cluster size</td>
        </tr>
        <tr>
            <td><code>DisableHTTPCaching()</code></td>
            <td>Disable HTTP Caching</td>
        </tr>
        <tr>
            <td><code>WithWorkerThreads(int count)</code></td>
            <td>Sets the number of worker threads to use in shared threadpool</td>
        </tr>
        <tr>
            <td><code>WithStatsPeriod(TimeSpan statsPeriod)</code></td>
            <td>Sets the period between statistics gathers</td>
        </tr>
        <tr>
            <td><code>EnableLoggingOfHttpRequests()</code></td>
            <td>Enable logging of Http Requests and Responses before they are processed</td>
        </tr>
        <tr>
            <td><code>EnableHistograms()</code></td>
            <td>Enable the tracking of various histograms in the backend, typically only used for debugging</td>
        </tr>
        <tr>
            <td><code>EnableTrustedAuth()</code></td>
            <td>Enable trusted authentication by an intermediary in the HTTP</td>
        </tr>
</tbody>
</table>

### Certificate options

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>WithServerCertificateFromFile(string path, string password)</code></td>
            <td>Sets the Server SSL Certificate to be loaded from a file</td>
        </tr>
        <tr>
            <td><code>WithServerCertificate(X509Certificate2 sslCertificate)</code></td>
            <td>Sets the Server SSL Certificate</td>
        </tr>
        <tr>
            <td><code>WithServerCertificateFromStore(StoreLocation storeLocation, StoreName storeName, string certificateSubjectName, string certificateThumbprint)</code></td>
            <td>Sets the Server SSL Certificate to be loaded from a certificate store</td>
        </tr>
        <tr>
            <td><code>WithServerCertificateFromStore(StoreName storeName, string certificateSubjectName, string certificateThumbprint)</code></td>
            <td>Sets the Server SSL Certificate to be loaded from a certificate store</td>
        </tr>
    </tbody>
</table>

### Cluster options

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>WithClusterGossipPort(int port)</code></td>
            <td>Sets the internal gossip port (used when using cluster dns, this should point to a known port gossip will be running on)</td>
        </tr>
        <tr>
            <td><code>WithGossipSeeds(params IPEndPoint[] endpoints)</code></td>
            <td>Sets the gossip seeds this node should talk to</td>
        </tr>
        <tr>
            <td><code>WithClusterDnsName(string name)</code></td>
            <td>Sets the dns name used for the discovery of other cluster nodes</td>
        </tr>
        <tr>
            <td><code>DisableDnsDiscovery()</code></td>
            <td>Disable dns discovery for the cluster</td>
        </tr>
        <tr>
            <td><code>WithGossipInterval(TimeSpan gossipInterval)</code></td>
            <td>Sets the gossip interval</td>
        </tr>
        <tr>
            <td><code>WithGossipAllowedTimeDifference(TimeSpan gossipAllowedDifference)</code></td>
            <td>Sets the allowed gossip time difference</td>
        </tr>
        <tr>
            <td><code>WithGossipTimeout(TimeSpan gossipTimeout)</code></td>
            <td>Sets the gossip timeout</td>
        </tr>
        <tr>
            <td><code>WithPrepareTimeout(TimeSpan prepareTimeout)</code></td>
            <td>Sets the prepare timeout </td>
        </tr>
        <tr>
            <td><code>WithCommitTimeout(TimeSpan commitTimeout)</code></td>
            <td>Sets the commit timeout </td>
        </tr>
        <tr>
            <td><code>WithPrepareCount(int prepareCount)</code></td>
            <td>Sets the number of nodes which must acknowledge prepares. </td>
        </tr>
        <tr>
            <td><code>WithCommitCount(int commitCount)</code></td>
            <td>Sets the number of nodes which must acknowledge commits before acknowledging to a client.  </td>
        </tr>
        <tr>
            <td><code>WithNodePriority(int nodePriority)</code></td>
            <td>Sets the node priority used during master election</td>
        </tr>
    </tbody>
</table>

### Database options

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>RunInMemory()</code></td>
            <td>Sets the builder to run in memory only</td>
        </tr>
        <tr>
            <td><code>RunOnDisk(string path)</code></td>
            <td>Sets the builder to write database files to the specified path</td>
        </tr>
        <tr>
            <td><code>MaximumMemoryTableSizeOf(int size)</code></td>
            <td>Sets the maximum size a memtable is allowed to reach (in count) before being moved to be a ptable</td>
        </tr>
        <tr>
            <td><code>DoNotVerifyDbHashes()</code></td>
            <td>Marks that the existing database files should not be checked for checksums on startup.</td>
        </tr>
        <tr>
            <td><code>VerifyDbHashes()</code></td>
            <td>Marks that the existing database files should be checked for checksums on startup.</td>
        </tr>
        <tr>
            <td><code>WithMinFlushDelay(TimeSpan minFlushDelay)</code></td>
            <td>Sets the minimum flush delay </td>
        </tr>
        <tr>
            <td><code>DisableScavengeMerging()</code></td>
            <td>Disables the merging of chunks when scavenge is running </td>
        </tr>
        <tr>
            <td><code>WithScavengeHistoryMaxAge(int scavengeHistoryMaxAge)</code></td>
            <td>The number of days to keep scavenge history (Default: 30)</td>
        </tr>
        <tr>
            <td><code>WithIndexPath(string indexPath)</code></td>
            <td>Sets the path the index should be loaded/saved to</td>
        </tr>
        <tr>
            <td><code>WithIndexCacheDepth(int indexCacheDepth)</code></td>
            <td>Sets the depth to cache for the mid point cache in index</td>
        </tr>
        <tr>
            <td><code>WithUnsafeIgnoreHardDelete()</code></td>
            <td>Disables Hard Deletes (UNSAFE: use to remove hard deletes)</td>
        </tr>
        <tr>
            <td><code>WithUnsafeDisableFlushToDisk()</code></td>
            <td>Disables Hard Deletes (UNSAFE: use to remove hard deletes)</td>
        </tr>
        <tr>
            <td><code>WithBetterOrdering()</code></td>
            <td>Enable Queue affinity on reads during write process to try to get better ordering.</td>
        </tr>
        <tr>
            <td><code>WithTfChunkSize(int chunkSize)</code></td>
            <td>Sets the transaction file chunk size. Default is <see cref="TFConsts.ChunkSize"/></td>
        </tr>
        <tr>
            <td><code>WithTfChunksCacheSize(long chunksCacheSize)</code></td>
            <td>Sets the transaction file chunk cache size. Default is <see cref="TFConsts.ChunksCacheSize"/></td>
        </tr>
        <tr>
            <td><code>WithTfCachedChunks(int cachedChunks)</code></td>
            <td>The number of chunks to cache in unmanaged memory.</td>
        </tr>
    </tbody>
</table>

### Interface options

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>OnDefaultEndpoints()</code></td>
            <td>Sets the default endpoints on localhost (1113 tcp, 2113 http)</td>
        </tr>
        <tr>
            <td><code>AdvertiseInternalIPAs(IPAddress intIpAdvertiseAs)</code></td>
            <td>Sets up the Internal IP that would be advertised</td>
        </tr>
        <tr>
            <td><code>AdvertiseExternalIPAs(IPAddress extIpAdvertiseAs)</code></td>
            <td>Sets up the External IP that would be advertised</td>
        </tr>
        <tr>
            <td><code>AdvertiseInternalHttpPortAs(int intHttpPortAdvertiseAs)</code></td>
            <td>Sets up the Internal Http Port that would be advertised</td>
        </tr>
        <tr>
            <td><code>AdvertiseExternalHttpPortAs(int extHttpPortAdvertiseAs)</code></td>
            <td>Sets up the External Http Port that would be advertised</td>
        </tr>
        <tr>
            <td><code>AdvertiseInternalSecureTCPPortAs(int intSecureTcpPortAdvertiseAs)</code></td>
            <td>Sets up the Internal Secure TCP Port that would be advertised</td>
        </tr>
        <tr>
            <td><code>AdvertiseExternalSecureTCPPortAs(int extSecureTcpPortAdvertiseAs)</code></td>
            <td>Sets up the External Secure TCP Port that would be advertised</td>
        </tr>
        <tr>
            <td><code>AdvertiseInternalTCPPortAs(int intTcpPortAdvertiseAs)</code></td>
            <td>Sets up the Internal TCP Port that would be advertised</td>
        </tr>
        <tr>
            <td><code>AdvertiseExternalTCPPortAs(int extTcpPortAdvertiseAs)</code></td>
            <td>Sets up the External TCP Port that would be advertised</td>
        </tr>
        <tr>
            <td><code>WithInternalHttpOn(IPEndPoint endpoint)</code></td>
            <td>Sets the internal http endpoint to the specified value</td>
        </tr>
        <tr>
            <td><code>WithExternalHttpOn(IPEndPoint endpoint)</code></td>
            <td>Sets the external http endpoint to the specified value</td>
        </tr>
        <tr>        
            <td><code>WithInternalTcpOn(IPEndPoint endpoint)</code></td>
            <td>Sets the internal tcp endpoint to the specified value</td>
        </tr>
        <tr>
            <td><code>WithInternalSecureTcpOn(IPEndPoint endpoint)</code></td>
            <td>Sets the internal secure tcp endpoint to the specified value</td>
        </tr>
        <tr>
            <td><code>WithExternalTcpOn(IPEndPoint endpoint)</code></td>
            <td>Sets the external tcp endpoint to the specified value</td>
        </tr>
        <tr>
            <td><code>WithExternalSecureTcpOn(IPEndPoint endpoint)</code></td>
            <td>Sets the external secure tcp endpoint to the specified value</td>
        </tr>
        <tr>
            <td><code>EnableSsl()</code></td>
            <td>Sets that SSL should be used on connections</td>
        </tr>
        <tr>
            <td><code>WithSslTargetHost(string targetHost)</code></td>
            <td>Sets the target host of the server's SSL certificate. </td>
        </tr>
        <tr>
            <td><code>ValidateSslServer()</code></td>
            <td>Sets whether to validate that the server's certificate is trusted.</td>
        </tr>
        <tr>
            <td><code>NoGossipOnPublicInterface()</code></td>
            <td>Disables gossip on the public (client) interface</td>
        </tr>
        <tr>
            <td><code>NoAdminOnPublicInterface()</code></td>
            <td>Disables the admin interface on the public (client) interface</td>
        </tr>
        <tr>
            <td><code>NoStatsOnPublicInterface()</code></td>
            <td>Disables statistics screens on the public (client) interface</td>
        </tr>
        <tr>
            <td><code>AddInternalHttpPrefix(string prefix)</code></td>
            <td>Adds a http prefix for the internal http endpoint</td>
        </tr>
        <tr>
            <td><code>AddExternalHttpPrefix(string prefix)</code></td>
            <td>Adds a http prefix for the external http endpoint</td>
        </tr>
        <tr>
            <td><code>DontAddInterfacePrefixes()</code></td>
            <td>Don't add the interface prefixes (e.g. If the External IP is set to the Loopback address, we'll add http://localhost:2113/ as a prefix) </td>
        </tr>
        <tr>
            <td><code>WithInternalHeartbeatInterval(TimeSpan heartbeatInterval)</code></td>
            <td>Sets the heartbeat interval for the internal network interface.</td>
        </tr>
        <tr>
            <td><code>WithExternalHeartbeatInterval(TimeSpan heartbeatInterval)</code></td>
            <td>Sets the heartbeat interval for the external network interface.</td>
        </tr>
        <tr>
            <td><code>WithInternalHeartbeatTimeout(TimeSpan heartbeatTimeout)</code></td>
            <td>Sets the heartbeat timeout for the internal network interface.</td>
        </tr>
        <tr>
            <td><code>WithExternalHeartbeatTimeout(TimeSpan heartbeatTimeout)</code></td>
            <td>Sets the heartbeat timeout for the external network interface.</td>
        </tr>
    </tbody>
</table>

### Projections options

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>StartStandardProjections()</code></td>
            <td>Start standard projections.</td>
        </tr>
        <tr>
            <td><code>RunProjections(ProjectionType projectionType, int numberOfThreads = Opts.ProjectionThreadsDefault)</code></td>
            <td>Sets the mode and the number of threads on which to run projections.</td>
        </tr>
        <tr>
            <td><code>RunProjections(ClientAPI.Embedded.ProjectionsMode projectionsMode, int numberOfThreads = Opts.ProjectionThreadsDefault)</code></td>
            <td>Sets the mode and the number of threads on which to run projections.</td>
        </tr>
    </tbody>
</table>


## EmbeddedEventStoreConnection

The following methods are available on `EmbeddedEventStoreConnection` for connecting to an embedded node

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>Create(ClusterVNode eventStore, string connectionName = null)</code></td>
            <td>Creates a new embedded <code>IEventStoreConnection</code> to a single node with default connection settings</td>
        </tr>
        <tr>
            <td><code>Create(ClusterVNode eventStore, ConnectionSettings connectionSettings, string connectionName = null)</code></td>
            <td>Creates a new embedded <code>IEventStoreConnection</code> to a single node using specific <code>ConnectionSettings</code></td>
        </tr>
    </tbody>
</table>
