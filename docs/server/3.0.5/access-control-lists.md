---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Access Control Lists"
section: "Server"
version: 3.0.5
---

## Stream ACLs

The ACL of a stream is kept in the streams [metadata](../metadata-and-reserved-names) as JSON with the below definition.

```json
{
   "$acl" : {
      "$w"  : "$admins",
      "$r"  : "$all",
      "$d"  : "$admins",
      "$mw" : "$admins",
      "$mr" : "$admins"
   }
}
```

These fields represent the following:

- `$w` The permission to write to this stream
- `$r` The permission to read from this stream
- `$d` The permission to delete this stream
- `$mw` The permission to write the metadata associated with this stream
- `$mr` The permission to read the metadata associated with this stream

These fields can be updated with either a single string or an array of strings representing users or groups (`$admins`, `$all`, or custom groups). It is also possible to put an empty array into one of these fields, this has the effect of remove all users from that permission. 

<span class='note'>It is not normally recommended to give people access to `$mw` as then they can then change the ACL.</span>

### Example

```json
{
   "$acl" : {
      "$w"  : "greg",
      "$r"  : ["greg", "john"],
      "$d"  : "$admins",
      "$mw" : "$admins",
      "$mr" : "$admins"
   }
}
```
This ACL would give `greg` read and write permission on the stream, while `john` would only have read permission on the stream. Only users in the `$admins` group would be able to delete the stream, or read and write the metadata.

## Default ACL

There is a special ACL in the `$settings` that is used as the default ACL. This stream controls the default ACL for streams without an ACL and also controls who can create streams in the system, the default state of these is shown below.

```json
{
    "$userStreamAcl" : {
        "$r"  : "$all",
        "$w"  : "$all",
        "$d"  : "$all",
        "$mr" : "$all",
        "$mw" : "$all"
    },
    "$systemStreamAcl" : {
        "$r"  : "$admins",
        "$w"  : "$admins",
        "$d"  : "$admins",
        "$mr" : "$admins",
        "$mw" : "$admins"
    }
}
```
The `$userStreamAcl` controls the default ACL for user streams, while the `$systemStreamAcl` is used as the default for all system streams.
<span class="note">`$w` in the `$userStreamAcl` also applies to the ability to create a stream.</span>
<span class="note">Members of `$admins` always have access to everything, this permission cannot be removed.</span>

When a permission is set on a stream in your system, it will override the default, however it is not necessary to specify all permissions on a stream, it is only necessary to specify those which differ from the default.

### Example

```json
{
    "$userStreamAcl" : {
        "$r"  : "$all",
        "$w"  : "ouro",
        "$d"  : "ouro",
        "$mr" : "ouro",
        "$mw" : "ouro"
    },
    "$systemStreamAcl" : {
        "$r"  : "$admins",
        "$w"  : "$admins",
        "$d"  : "$admins",
        "$mr" : "$admins",
        "$mw" : "$admins"
    }
}
```
This default ACL would give `ouro` and `$admins` create and write permissions on all streams, while everyone else can read from them.

```json
{
   "$acl" : {
      "$r"  : ["greg", "john"],
   }
}
```
If you added the above to a stream's ACL, then it would override the read permission on that stream to allow `greg` and `john` to read streams, but not `ouro`, resulting in the effective ACL below.

```json
{
   "$acl" : {
      "$r"  : ["greg", "john"],
      "$w"  : "ouro",
      "$d"  : "ouro",
      "$mr" : "ouro",
      "$mw" : "ouro"
   }
}

```
<span class="note--warning">
Caching will be allowed on a stream if you have enabled it to be visible to `$all`. This is done as a performance optimization to avoid having to set `cache=private` on all data. If people are bookmarking your URIs and they have been cached by an intermediary then they may still be accessible after you change the permissions from `$all`. While clients should not be bookmarking URIs in this way it is an important consideration.
</span>
