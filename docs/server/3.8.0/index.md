---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Running the Event Store"
section: "Server"
version: "3.8.0"
pinned: true
---

The Event Store runs as a server, to which clients can connect either over HTTP or using one of the client APIs. Both the open source, and commercial versions, can be run as either a single node, or a highly available cluster of nodes.

The [open source version of Event Store](https://geteventstore.com/downloads) is distributed as a console application. There are separate distributions for Windows on .NET and Linux/macOS on Mono.

## Running the Open Source version

<span class="note--warning">
Unless passed a database option, the Event Store will write to a new database created in the system’s temporary files path each time it is started. For more information on Command Line Arguments look [here](./command-line-arguments).
</span>

### On Windows and .NET

A typical command line for running the Event Store server on Windows is:

```
c:\EventStore> EventStore.ClusterNode.Exe --db .\ESData
```

#### Setting up HTTP Permissions

The Event Store has an HTTP interface. Consequently the identity under which you want to run the Event Store must have permission to listen to incoming HTTP requests, as detailed [here](http://msdn.microsoft.com/en-us/library/ms733768.aspx).

In order to configure an account with permission to listen for incoming HTTP requests, you can execute the following in PowerShell, or the Command Prompt, running as administrator (replace `DOMAIN\username` with the actual account details, and the port number if the default port is not being used).

```
netsh http add urlacl url=http://+:2113/ user=DOMAIN\username
```

#### If you get 503 errors from the web UI

There is a [known issue](http://stackoverflow.com/questions/8142396/what-causes-a-httplistener-http-503-error) with the .NET `HTTPListener` class (which the Event Store uses) and bad URL ACL registrations which can cause servers to return 503 errors for every request. If you see this, you can issue the following commands:

```
netsh http show urlacl
```

Look for an entry on the port you’re trying to use (`2113` unless you’ve specified a custom port). It will probably look something like: `http://+:2113`. Then issue:

```
netsh http delete urlacl <the entry you just found>

(e.g.):
netsh http delete urlacl http://+:2113
```

This should resolve the issue.

### On Linux/macOS

A typical command line for running the Event Store server on Linux/macOS is:

```
$ ./run-node.sh --db ./ESData
```

Although you can run the Event Store binary directly, a `run-node` shell script is provided which exports the environment variable `LD_LIBRARY_PATH` to include the installation path of the Event Store, this is necessary if you are planning to use projections.

The Event Store builds for both Linux and macOS have the Mono runtime bundled in, this means that you do not need Mono installed locally to run Event Store.

### Shutting down an Event Store node

Event Store has been designed to be safe by default - it is expected that it will but shut down using `kill -9`. However, it is also possible to initiate a shutdown via the web UI, by clicking on the "Shutdown Server" button located on the "Admin" page. This may be useful if you do not have console access to the node, or need to script initiating a shutdown.
