Projections has a RESTful API that you can run and monitor your projections from your own code if you want. This document goes through how that API works. If you want to get into further code examples the [esquery tool](esquery) and the padmin tools also use this API to run and monitor the status of projections and queries. For the purposes of this document all examples will be done using [curl](http://curl.haxx.se)

###Running a Query###

To create a query in the system you just post the javascript of the query to the /projections/transient url. You can control whether or not to start it by passing the ?enabled=true/false option. 

```
ouro@ouroboros:>cat projection.txt
fromAll().
    when({
       $init : function() {return {count : 0}},
       $any  : function(s,e) {return {count : s.count +1}}
    })
```

```
C:\curl>curl -i -d @projection.txt http://127.0.0.1:2113/projections/transient?enabled=yes -u admin:changeit -H "Content-Type: application/json"
```

```http
HTTP/1.1 201 Created
Content-Length: 75
Content-Type: application/json; charset: utf-8
Location: http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Date: Wed, 04 Sep 2013 20:32:42 GMT

{
  "msgTypeId": 145,
  "name": "c6689a67-aba6-41b1-aecc-a158bf4343af"
}
```

This has created the projection and as we set enabled it will already be running. The response returns a Location where we can access information about this projection in this case http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af.

`C:\curl>curl -i http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af`

```http
HTTP/1.1 200 OK
Cache-Control: max-age=0, no-cache, must-revalidate
Content-Length: 1311
Content-Type: application/json; charset: utf-8
Vary: Accept
Server: Microsoft-HTTPAPI/2.0
Access-Control-Allow-Methods: GET, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-PINGOTHER
Access-Control-Allow-Origin: *
Date: Wed, 04 Sep 2013 20:34:29 GMT

{
  "version": 0,
  "epoch": -1,
  "effectiveName": "c6689a67-aba6-41b1-aecc-a158bf4343af",
  "writesInProgress": 0,
  "readsInProgress": 1,
  "partitionsCached": 1,
  "status": "Completed/Stopped/Writing results",
  "stateReason": "",
  "name": "c6689a67-aba6-41b1-aecc-a158bf4343af",
  "mode": "Transient",
  "position": "Phase: 1 (completed)",
  "progress": 100.0,
  "lastCheckpoint": "Phase: 1",
  "eventsProcessedAfterRestart": 1,
  "statusUrl": "http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af",
  "stateUrl": "http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af/state",
  "resultUrl": "http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af/result",
  "queryUrl": "http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af/query?config=yes",
  "resultStreamUrl": "http://127.0.0.1:2113/streams/%24projections-c6689a67-aba6-41b1-aecc-a158bf4343af-result",
  "enableCommandUrl": "http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af/command/enable",
  "disableCommandUrl": "http://127.0.0.1:2113/projection/c6689a67-aba6-41b1-aecc-a158bf4343af/command/disable",
  "checkpointStatus": "",
  "bufferedEvents": 0,
  "writePendingEventsBeforeCheckpoint": 0,
  "writePendingEventsAfterCheckpoint": 1
}
```

This URI will tell us the status of the query as it runs including the % done it is for large queries. For a long running query you would poll this uri in order to give a user updated status about it's running. You can also check the current state (stateUrl), the results (resultUrl), the query text itself (queryUrl). You are also given urls for pausing/starting the processing of the query.

Either when the query finishes or in some cases such as foreachStream() queries while the query is running results will be written out to the resultUrl. All queries return a stream as their result. This uri points to the atom feed representing the results of the query. In order to read result just read all the events in the atomfeed.

