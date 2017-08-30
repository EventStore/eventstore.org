---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "User Management"
section: ".NET API"
version: "3.7.0"
---

The Event Store Client API includes some helper methods that use the HTTP API to allow for the management of users in the system. This document will describe the methods found in the UsersManager class (in addition to the XML docs already on it). Note all methods in this class are async.

## Methods

### Create a User

Creates a user, the credentials for this operation must be a member of the $admins group

```csharp
public Task CreateUserAsync(string login, string fullName, string[] groups, string password, UserCredentials userCredentials = null)
```

### Disable a User

Disables a user, the credentials for this operation must be a member of the $admins group

```csharp
public Task DisableAsync(string login, UserCredentials userCredentials = null)
```

### Enable a User

Enables a user, the credentials for this operation must be a member of the $admins group

```csharp
public Task EnableAsync(string login, UserCredentials userCredentials = null)
```

### Delete a User

Deletes (non-recoverable) a user, the credentials for this operation must be a member of the $admins group. If you prefer to be recoverable, disable the user as opposed to deleting the user.

```csharp
public Task DeleteUserAsync(string login, UserCredentials userCredentials = null)
```

### List all Users

Lists all users.

```csharp
public Task<List<UserDetails>> ListAllAsync(UserCredentials userCredentials = null) 
```

### Get Details of User

This will return the details of the user that is supplied in user credentials (eg the user making the request)

```csharp
public Task<UserDetails> GetCurrentUserAsync(UserCredentials userCredentials) 
```

### Get Details of Logged in User

```csharp
public Task<UserDetails> GetUserAsync(string login, UserCredentials userCredentials) 
```

### Update User Details

```csharp
public Task UpdateUserAsync(string login, string fullName, string[] groups, UserCredentials userCredentials = null)
```

### Reset User Password

Resets the password of a user. The credentials doing this operation must be part of the $admins group.

```csharp
public Task ResetPasswordAsync(string login, string newPassword, UserCredentials userCredentials = null)
```