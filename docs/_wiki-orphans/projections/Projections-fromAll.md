The **fromAll** method in the projections library is a selector that will select all of the events in the system. You can run fromAll() from the [esquery tool](esquery).

```
q fromAll()

```

```
7@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "$e": "$by_event_type"
}
6@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "loginName": "admin",
  "fullName": "Event Store Administrator",
  "salt": "9SRWdA15LJ/uvy8OHnEjvw==",
  "hash": "lCNM8ghRMdWE33OnamcYwXweUXI=",
  "disabled": false,
  "groups": [
    "$admins"
  ]
}
5@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "$e": "$stream_by_category"
}
4@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "$e": "$users"
}
3@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "$e": "$streams"
}
2@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "$e": "$by_category"
}
1@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "$e": ""
}
0@$projections-25436498-ef58-4577-840b-482242b5b106-result
{
  "$acl": {
    "$w": "$admins",
    "$d": "$admins",
    "$mw": "$admins"
  }
}

[snipped as there are a lot of events to print when doing all]
```

fromAll() assures ordering and is repeatable to run.

The fromAll() while conceptually returning all events does have some other behaviours associated with it in certain circumstances. If possible the query engine will try to avoid scanning all events prefering to use indexes. If for example you were to use :

```
query fromAll()
	    .when({
             Fooed  : function(s,e) {return 1},
             Barred : function(s,e) {return 0} 
        })
```

This query can be optimized away from having to look at every event through the use of indexes. It is functionally equivalent to:

```
query fromStreams(['$et-Barred', '$et-Fooed'])
	    .when({
             Fooed  : function(s,e) {return 1},
             Barred : function(s,e) {return 0} 
        })
```

As the second query is only looking at two streams in the system (that are maintained by a built in projection) it will be faster than the first in most circumstances.

You can read more about this in the section discussing [when optimizations](Projections-when-Optimizations)

![Google analytics pixel](https://gaproxy-1.apphb.com/UA-40176181-1/Wiki/esquery)