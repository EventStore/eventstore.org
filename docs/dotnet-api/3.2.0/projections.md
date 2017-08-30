---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Projections Management"
section: ".NET API"
version: "3.2.0"
---

**PROJECTIONS ARE STILL IN BETA THIS DOCUMENTATION IS SUBJECT TO CHANGE WITHOUT NOTICE

The Event Store Client API includes some helper methods that use the HTTP API to allow for the management of projections in the system. This document will describe the methods found in the ProjectionsManager class (in addition to the XML docs already on it). Note all methods in this class are async.

## Methods

### Enable a Projection

Enables an existing projection by its name. You must have access to a projection in order to enable it.

```csharp
public Task EnableAsync(string name, UserCredentials userCredentials = null)
```

### Disable a Projection

Disables an existing projection by its name. You must have access to a projection in order to disable it.

```csharp
public Task DisableAsync(string name, UserCredentials userCredentials = null)
```

### Abort a Projection

Aborts an existing projection by its name. You must have access to a projection in order to abort it.

```csharp
public Task AbortAsync(string name, UserCredentials userCredentials = null)
```

### Create a One-Time Projection

Creates a projection that will run until the end of the log and then stop. The query parameter contains the javascript you want to be created as a one time projection.

```csharp
public Task CreateOneTimeAsync(string query, UserCredentials userCredentials = null)
```

### Create a Continuous Projection

Creates a projection that will run until the end of the log and then continue running. The query parameter contains the javascript you want to be created as a one time projection. Continuous projections have explicit names and can be enabled/disabled via this name

```csharp
public Task CreateContinuousAsync(string name, string query, UserCredentials userCredentials = null)
```

### List all Projections

Returns a list of all the projections in the system.
//TODO make this return objects.

```csharp
public Task<string> ListAllAsync(UserCredentials userCredentials = null)
```

### List One-Time Projections

Returns a list of all One-Time Projections in the system
//TODO make this return objects.

```csharp
public Task<string> ListOneTimeAsync(UserCredentials userCredentials = null)
```

### Get Statistics on Projection

Returns the statistics associated with a named projection

```csharp
public Task<string> GetStatisticsAsync(string name, UserCredentials userCredentials = null)
```

### Delete Projection

Deletes a named projection. You must have access to a projection in order to delete it.

```csharp
        public Task DeleteAsync(string name, UserCredentials userCredentials = null)
```