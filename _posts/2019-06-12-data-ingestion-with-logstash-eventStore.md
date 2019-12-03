---
layout: blog-post
title: Data ingestion with Logstash and EventStore
author: Riccardo Di Nuzzo
category: "Tutorials"
tags: ["Event Store"]
---

In this post our challenge is to load a CSV file and ingest it using the Event Store HTTP API to be ingested.

To be precise, we want to convert this:

```csv
Europe,Italy,Clothes,Online,M,12/17/2013,278155219,1/10/2014,1165,109.28,35.84,127311.20,41753.60,85557.60
```

To this (which is an example of an HTTP POST to the Event Store HTTP API):

```shell
[
    {
        "eventId": "fbf4b1a1-b4a3-4dfe-a01f-ec52c34e16e4",
        "eventType": "InboundDataReceived",
        "data": {
            "message": "Europe,Italy,Clothes,Online,M,12/17/2013,278155219,1/10/2014,1165,109.28,35.84,127311.20,41753.60,85557.60"
        },
        "metadata": {
            "host": "box-1",
            "path": "/usr/data/sales.csv"
        }
    }
]
```

In this example we set several different parts of the HTTP POST, including a unique `eventId`, and enrich each message with metadata (like the `host` and the file `path`).

This data will be invaluable later for finding the specific mapping for that particular data source and to keep track of the origin.

<!-- TODO: What is this about? -->

![enter image description here](https://i2.wp.com/www.dinuzzo.co.uk/wp-content/uploads/2018/04/DDD_dataIngestion.png?w=600)

The API Gateway is our internal data collection endpoint. In my opinion, it must be a simple HTTP Endpoint. There is no need for a heavyweight framework that can potentially add complexity and little value.

In this case, we are using the existing Event Store HTTP API as the API Gateway, and Logstash to monitor folders and convert the CSV lines into JSON Messages.

Logstash is a powerful tool that can keep track of the last ingested position in case something goes wrong and/or the file changes.

There are other tools available for this task, such as Telegraf, but I personally have more experience using Logstash.

Once that the messages are flowing through the API Gateway, we can then implement Domain Components or Microservices that subscribe to these messages and provide validation, mapping, and Domain business logic. The results will then be saved in their own data streams as Domain Events.

To avoid repeatedly  the data in the inbound stream, you can also set an optional retention period after which the messages are automatically removed from the system.

Try it yourself:

1.  Download  [Logstash](https://www.elastic.co/downloads/logstash)  and  [Event Store](https://eventstore.org/downloads/)
2.  Create a folder called “inbound” and copy/paste in a new logstash.yml file (here's my gist for reference/inspiration: <https://gist.github.com/riccardone/18c176dab737631c9a216e89b79acdb7>)
3.  If you are on a Windows computer, create a logstash.bat file so you can easily run logstash. Its contents will depend on your file paths but in my case it's:  C:\\services\\logstash-6.2.4\\bin\\logstash -f C:\\inbound\\logstash.yml
4.  Then, from a command line, run logstash
5.  Create a subdirectory inbound/<youclientname> e.g. c:\\inbound\\RdnSoftware
6.  Copy a CSV file into the folder and let the ingestion begin

With this Logstash input configuration, when you have a new client you can just add another folder and start ingesting the data. For production environments, you can combine Logstash with Filebeat to distribute part of the ingestion workload to separate boxes.

In some scenarios - especially when the data has not yet been discovered and you don’t have a mapper - it will be easier to direct the data straight into a semi-structured data lake for further analysis.

Hope that you enjoyed my little data ingestion example.

Here's the 15-minute webinar if you'd like to watch me go through everything above and find out a little more: <https://youtu.be/2nyzvrIdnPg>
