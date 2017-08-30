---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Connecting to a Server"
section: ".NET API"
version: "3.7.0"
---

## EventStoreConnection

The `EventStoreConnection` class is responsible for maintaining a full-duplex connection between the client and the Event Store server. `EventStoreConnection` is thread-safe and it is recommended that only one instance per application is created.

All operations are handled fully asynchronously and return either a `Task` or a `Task<T>`. If you need to execute synchronously simply call `.Wait()`, or `Result` on the asynchronous version.

To get maximum performance from the connection it is recommended that it be used asynchronously.

<span class="note">
The `Create` methods have changed slightly moving to 3.0.2 as connection strings are now supported. The old mechanisms will still work but have been marked obsolete and will be removed in the future.
</span>

## Creating a Connection

The static `Create` methods on `EventStoreConnection` are used to create a new connection. All overloads allow you to optionally specify a name for the connection, which is returned when the connection raises events (see [Connection Events](#connection-events)).

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>Create(Uri uri)</code></td>
            <td>Connects to Event Store (see URIs below) with default settings</td>
        </tr>
        <tr>
            <td><code>Create(ConnectionSettings connectionSettings, Uri uri)</code></td>
            <td>Connects to Event Store (see URIs below) with specified settings</td>
        </tr>
        <tr>
            <td><code>Create(string connectionString)</code></td>
            <td>Connects to Event Store (see URIs below) with settings from connection string</td>
        </tr>
        <tr>
            <td><code>(obsolete) Create(IPEndPoint tcpEndPoint)</code></td>
            <td>Connects to a single node with default settings</td>
        </tr>
        <tr>
            <td><code>(obsolete) Create(ConnectionSettings settings, IPEndPoint tcpEndPoint)</code></td>
            <td>Connects to a single node with custom settings (see <a href="#customising-connection-settings">Customising Connection Settings</a>)</td>
        </tr>
        <tr>
            <td><code>(obsolete) Create(ConnectionSettings connectionSettings, ClusterSettings clusterSettings)</code></td>
            <td>Connects to an Event Store HA cluster with custom settings (see <a href="#cluster-settings">Cluster Settings</a>)</td>
        </tr>
    </tbody>
</table>

<span class="note">
The connection returned by these methods is inactive. Use the `ConnectAsync()` method to establish a connection with the server.
</span>

## URIs

The new Create methods support passing of a URI to the connection as opposed to passing IPEndPoints. This URI should be in the format of:

- Single Node `tcp://user:password@myserver:11234`
- Cluster `discover://user:password@myserver:1234`

Where the port number points to the TCP port of the Event Store instance (1113 by default) or points to the manager gossip port for discovery purposes.

With the URI based mechanism you can pass a domain name and the client will resolve it.

<span class="note">
The client currently does a blocking DNS call for single node. If you are worried about blocking DNS due to network issues etc you should resolve the DNS yourself and pass in an IP address.
</span>


## Customising Connection Settings

### Connection String

Many of the overloads accept a connection string that can be used to control settings of the connection. A benefit to having these as a connection string as opposed to with the fluent API is that they can be changed easily between environments without recompiling (say single node in `dev` and a cluster in `production`).

The connection string format should look familiar to those who have used connection strings in the past. It is made up of a series of key/value pairs Key = Value separated by semicolons.

The following values can be set using the connection string.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Format</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>VerboseLogging</td>
            <td>True/false</td>
            <td>Enables verbose logging</td>
        </tr>
        <tr>
            <td>MaxQueueSize</td>
            <td>Integer</td>
            <td>Maximum number of outstanding operations</td>
        </tr>
        <tr>
            <td>MaxConcurrentItems</td>
            <td>Integer</td>
            <td>Maximum number of concurrent async operations</td>
        </tr>
        <tr>
            <td>MaxRetries</td>
            <td>Integer</td>
            <td>Maximum number of retry attempts</td>
        </tr>
        <tr>
            <td>MaxReconnections</td>
            <td>Integer</td>
            <td>The maximum number of times to try reconnecting</td>
        </tr>
        <tr>
            <td>RequireMaster</td>
            <td>True/false</td>
            <td>If set the server will only process if it is master</td>
        </tr>
        <tr>
            <td>ReconnectionDelay</td>
            <td>Integer (milliseconds)</td>
            <td>The delay before attempting to reconnect</td>
        </tr>
        <tr>
            <td>OperationTimeout</td>
            <td>Integer (milliseconds)</td>
            <td>The time before an operation is considered timed out</td>
        </tr>
        <tr>
            <td>OperationTimeoutCheckPeriod</td>
            <td>Integer (milliseconds)</td>
            <td>The frequency in which timeouts are checked</td>
        </tr>
        <tr>
            <td>DefaultUserCredentials</td>
            <td>String in format username:password</td>
            <td>The default credentials for the connection</td>
        </tr>
        <tr>
            <td>UseSslConnection</td>
            <td>True/false</td>
            <td>whether to use SSL for this connection</td>
        </tr>
        <tr>
            <td>TargetHost</td>
            <td>String</td>
            <td>The hostname expected on the certificate</td>
        </tr>
        <tr>
            <td>ValidateServer</td>
            <td>True/false</td>
            <td>Whether or not to validate the remote server</td>
        </tr>
        <tr>
            <td>FailOnNoServerResponse</td>
            <td>True/False</td>
            <td>Whether or not to fail on no server response</td>
        </tr>
        <tr>
            <td>HeartbeatInterval</td>
            <td>Integer (milliseconds)</td>
            <td>The interval at which to send the server a heartbeat</td>
        </tr>
        <tr>
            <td>HeartbeatTimeout</td>
            <td>Integer (milliseconds)</td>
            <td>The amount of time to receive a heartbeat response before timing out</td>
        </tr>
        <tr>
            <td>ClusterDns</td>
            <td>string</td>
            <td>The dns name of the cluster for discovery</td>
        </tr>
        <tr>
            <td>MaxDiscoverAttempts</td>
            <td>Integer</td>
            <td>The maximum number of attempts to try to discover the cluster</td>
        </tr>
        <tr>
            <td>ExternalGossipPort</td>
            <td>Integer</td>
            <td>The port to try to gossip on</td>
        </tr>
        <tr>
            <td>GossipTimeout</td>
            <td>Integer (milliseconds)</td>
            <td>The amount of time before timing out a gossip response</td>
        </tr>
        <tr>
            <td>GossipSeeds</td>
            <td>Comma separated list of ip:port</td>
            <td>A list of seeds to try to discover from</td>
        </tr>
        <tr>
            <td>ConnectTo</td>
            <td>A URI in format described above to connect to</td>
            <td>The URI to connect to</td>
        </tr>
    </tbody>
</table>

<span class="note">
You can also use spacing instead of camel casing in your connection string if you prefer.
</span>

```
var connectionString = "ConnectTo=tcp://admin:changeit@localhost:1113; HeartBeatTimeout=500"
```

Sets the connection string to connect to localhost on the default port and sets the heartbeat timeout to 500ms.

```
var connectionString = "Connect To = tcp://admin:changeit@localhost:1113; Gossip Timeout = 500"
```

Using spaces

```
var connectionString = "ConnectTo=discover://admin:changeit@mycluster:3114; HeartBeatTimeout=500"
```

Tells the connection to try gossiping to a manager found under the DNS mycluster at port 3114 to connect to the cluster.

```
var connectionString = "GossipSeeds=192.168.0.2:1111,192.168.0.3:1111; HeartBeatTimeout=500"
```

Tells the connection to try gossiping to the gossip seeds `192.168.0.2` or `192.168.0.3` on port 1111 to discover information about the cluster.

<span class="note">
See fluent API below for defaults of values.
</span>

<span class="note">
You can also use the ConnectionString class to return you a `ConnectionSettings` object.
</span>


### Fluent API

Settings used for modifying the behaviour of an `EventStoreConnection` are encapsulated into an object of type `ConnectionSettings` which is passed as a paramater to the `Create` methods listed above.

Instances of `ConnectionSettings` are created using a fluent builder class as follows:

```CSharp
ConnectionSettings settings = ConnectionSettings.Create();
```

This will create an instance of `ConnectionSettings` with the default options. These can be overridden by chaining the additional builder methods described below.

### Logging

The .NET API can log information to a number of different destinations. By default no logging is enabled.

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>UseConsoleLogger()</code></td>
            <td>Output log messages using <code>Console.WriteLine</code></td>
        </tr>
        <tr>
            <td><code>UseDebugLogger()</code></td>
            <td>Output log messages using <code>Debug.WriteLine</code></td>
        </tr>
        <tr>
            <td><code>UseCustomLogger()</code></td>
            <td>Output log messages to the specified instance of <code>ILogger</code> (You should implement this interface in order to log using another library such as NLog or log4net).</td>
        </tr>
        <tr>
            <td><code>EnableVerboseLogging()</code></td>
            <td>Turns on verbose logging.<br>By default information about connection, disconnection and errors are logged, however it can be useful to have more information about specific operations as they are occuring.</td>
        </tr>
    </tbody>
</table>

### User Credentials

Event Store supports [Access Control Lists](/docs/server/latest/access-control-lists) that restrict permissions for a stream based on users and groups. `EventStoreConnection` allows you to supply credentials for each operation, however it is often more convenient to simply set some default credentials for all operations on the connection.

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>SetDefaultUserCredentials(UserCredentials credentials)</code></td>
            <td>Sets the default <code>UserCredentials</code> to be used for this connection. If user credentials are not given for an operation these credentials will be used.</td>
        </tr>
    </tbody>
</table>

A `UserCredentials` object can be created as follows:

```CSharp
UserCredentials credentials = new UserCredentials("username","password");
```

### Security

The .NET API and Event Store can communicate either over SSL or an unencrypted channel (by default).

To configure the client-side of the SSL connection, use the builder method below. For more information on setting up the server end of the Event Store for SSL, see [SSL Setup](/docs/http-api/latest/setting-up-ssl-windows).

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>UseSslConnection(string targetHost, bool validateServer)</code></td>
            <td>Uses an SSL-encrypted connection where:
                <dl>
                    <dt><code>targetHost</code></dt>
                    <dd>Is the name specified on the SSL certificate installed on the server.</dd>
                    <dt><code>validateServer</code></dt>
                    <dd>Controls whether or not the server certificate is validated upon connection.</dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

<span class="note--warning">
In production systems where credentials are being sent from the client to the Event Store, SSL-encryption should *always* be used and `validateServer` should be set to `true`.
</span>

### Node Preference

When connecting to an Event Store HA cluster you can specify that operations can be performed on any node, or only on the node that is the master.

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>PerformOnMasterOnly()</code></td>
            <td>Require all write and read requests to be served only by the master (Default).</td>
        </tr>
        <tr>
            <td><code>PerformOnAnyNode()</code></td>
            <td>Allow for writes to be forwarded and read requests to be served locally if the current node is not master.</td>
        </tr>
    </tbody>
</table>

### Handling Failures

The following methods on the `ConnectionSettingsBuilder` allow you to modify the way the connection handles operation failures and connection issues.

#### Reconnections

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>WithConnectionTimeoutOf<br>(TimeSpan timeout)</code></td>
            <td>Sets the timeout to connect to a server before aborting and attempting a reconnect (Default: 1 second).</td>
        </tr>
        <tr>
            <td><code>LimitReconnectionsTo<br>(int limit)</code></td>
            <td>Limits the number of reconnections this connection can try to make (Default: 10).</td>
        </tr>
        <tr>
            <td><code>KeepReconnecting()</code></td>
            <td>Allows infinite reconnection attempts.</td>
        </tr>
        <tr>
            <td><code>SetReconnectionDelayTo<br>(TimeSpan reconnectionDelay)</code></td>
            <td>Sets the delay between reconnection attempts (Default: 100ms).</td>
        </tr>
        <tr>
            <td><code>SetHeartbeatInterval<br>(TimeSpan interval)</code></td>
            <td>Sets how often heartbeats should be expected on the connection (lower values detect broken sockets faster) (Default: 750ms).</td>
        </tr>
        <tr>
            <td><code>SetHeartbeatTimeout<br>(TimeSpan timeout)</code></td>
            <td>Sets how long to wait without heartbeats before determining a connection to be dead (must be longer than the heatrbeat interval) (Default: 1500ms).</td>
        </tr>
    </tbody>
</table>

#### Operations

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>SetOperationTimeout<br>(TimeSpan timeout)</code></td>
            <td>Sets the operation timeout duration (Default: 7 seconds).</td>
        </tr>
        <tr>
            <td><code>SetTimeoutCheckPeriodTo<br>(TimeSpan timeoutCheckPeriod)</code></td>
            <td>Sets how often timeouts should be checked for (Default: 1 second).</td>
        </tr>
        <tr>
            <td><code>LimitAttemptsForOperationTo<br>(int limit)</code></td>
            <td>Limits the number of operation attempts (Default: 11).</td>
        </tr>
        <tr>
            <td><code>LimitRetriesForOperationTo<br>(int limit)</code></td>
            <td>Limits the number of operation retries (Default: 10).</td>
        </tr>
        <tr>
            <td><code>KeepRetrying()</code></td>
            <td>Allows infinite operation retries.</td>
        </tr>
        <tr>
            <td><code>LimitOperationsQueueTo<br>(int limit)</code></td>
            <td>Sets the limit for number of outstanding operations (Default: 5000).</td>
        </tr>
        <tr>
            <td><code>FailOnNoServerResponse()</code></td>
            <td>Marks that no response from server should cause an error on the request.</td>
        </tr>
    </tbody>
</table>

## Cluster Settings

When connecting to an Event Store HA cluster you must pass an instance of `ClusterSettings` as well as the usual `ConnectionSettings`. Primarily this is used to tell the `EventStoreConnection` how to discover all the nodes in the cluster. A connection to a cluster will automatically handle reconnecting to a new node if the current connection fails.

### Using DNS Discovery

DNS discovery uses a single DNS entry with several records listing all node IP addresses. The EventStoreConnection will then use a well known port to gossip with the nodes.

Use `ClusterSettings.Create().DiscoverClusterViaDns()` followed by:

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>SetClusterDns(string clusterDns)</code></td>
            <td>Sets the DNS name under which cluster nodes are listed.</td>
        </tr>
        <tr>
            <td><code>SetClusterGossipPort(int clusterGossipPort)</code></td>
            <td>Sets the well-known port on which the cluster gossip is taking place.</td>
        </tr>
        <tr>
            <td><code>SetMaxDiscoverAttempts(int maxDiscoverAttempts)</code></td>
            <td>Sets the maximum number of attempts for discovery (Default: 10).</td>
        </tr>
        <tr>
            <td><code>SetGossipTimeout(TimeSpan timeout)</code></td>
            <td>Sets the period after which gossip times out if none is received (Default: 1 second).</td>
        </tr>
    </tbody>
</table>

<span class="note">
If you are using the commercial edition of Event Store HA with Manager nodes in place, the gossip port should be the port number of the external HTTP port on which the managers are running.<br><br>
If you are using the open source edition of Event Store HA the gossip port should be the External HTTP port that the nodes are running on. If you cannot use a well-known port for this across all nodes you can instead use gossip seed discovery and set the `IPEndPoint` of some seed nodes instead.
</span>

### Connecting Using Gossip Seeds

The second supported method for node discovery uses a hardcoded set of `IPEndPoint`s as gossip seeds.

Use `ClusterSettings.Create().DiscoverClusterViaGossipSeeds()` followed by:

<table>
    <thead>
        <tr>
            <th>Builder Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>SetGossipSeedEndPoints(params IPEndPoint[] gossipSeeds)</code></td>
            <td>Sets gossip seed endpoints for the client.</td>
        </tr>
        <tr>
            <td><code>SetGossipSeedEndPoints(params GossipSeed[] gossipSeeds)</code></td>
            <td>Same as above, but allows a specific `Host` header to be sent with all HTTP requests.</td>
        </tr>
        <tr>
            <td><code>SetMaxDiscoverAttempts(int maxDiscoverAttempts)</code></td>
            <td>Sets the maximum number of attempts for discovery (Default: 10).</td>
        </tr>
        <tr>
            <td><code>SetGossipTimeout(TimeSpan timeout)</code></td>
            <td>Sets the period after which gossip times out if none is received (Default: 1 second).</td>
        </tr>
    </tbody>
</table>

## Connection Events

`EventStoreConnection` exposes a number of events that your application can use in order to be notifed of changes to the status of the connection.

<table>
    <thead>
        <tr>
            <th>Event</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>EventHandler&lt;ClientConnectionEventArgs&gt; Connected</code></td>
            <td>Fired when an <code>IEventStoreConnection</code> connects to an Event Store server.</td>
        </tr>
        <tr>
            <td><code>EventHandler&lt;ClientConnectionEventArgs&gt; Disconnected</code></td>
            <td>Fired when an <code>IEventStoreConnection</code> is disconnected from an Event Store server by some means other than by calling the <code>Close</code> method.</td>
        </tr>
        <tr>
            <td><code>EventHandler&lt;ClientReconnectingEventArgs&gt; Reconnecting</code></td>
            <td>Fired when an <code>IEventStoreConnection</code> is attempting to reconnect to an Event Store server following a disconnection.</td>
        </tr>
        <tr>
            <td><code>EventHandler&lt;ClientClosedEventArgs&gt; Closed</code></td>
            <td>Fired when an <code>IEventStoreConnection</code> is closed either using the <code>Close</code> method or when reconnection limits are reached without a successful connection being established.</td>
        </tr>
        <tr>
            <td><code>EventHandler&lt;ClientErrorEventArgs&gt; ErrorOccurred</code></td>
            <td>Fired when an error is thrown on an <code>IEventStoreConnection</code>.</td>
        </tr>
        <tr>
            <td><code>EventHandler&lt;ClientAuthenticationFailedEventArgs&gt; AuthenticationFailed</code></td>
            <td>Fired when a client fails to authenticate to an Event Store server.</td>
        </tr>
    </tbody>
</table>
