---
title: "Event Store 3.0.0 - Using Event Store from the JVM"
date: 2014-09-04T12:00Z
author: "James Nugent"
layout: blog-post
---

<p class="lead">As we gear up to launch version 3.0.0 of Event Store at our annual birthday party (which you should totally come to!), we decided it would be a good idea to run a short series of articles describing some of the new features and changes for those who haven’t seen them. If there are things you want to know about in particular, please get in touch on Twitter, <a href="https://twitter.com/eventstore">@eventstore</a></p>

##Using Event Store From JVM Languages

One of the reasons the Event Store has an HTTP API is to make it possible to talk from any platform capable of making HTTP requests. However, there are some things that we currently can’t do over HTTP (at least until HTTP 2.0 is "done"!) - for example, push subscriptions to streams, though the long polling mechanism can approximate this.

The `master` branch of the repository supports the current stable v2.0.1 release, however v3.0.0-rc2 support is available on a branch, and the final release of v3.0.0 will be supported by the release date.

In addition the .NET client, we have a first party JVM API, based on Akka, as well as a community-contributed API written in pure Java.

###Akka API

The [EventStore/EventStore.JVM](https://github.com/EventStore/EventStore.JVM) repository on GitHub contains the Akka-based client, which is maintained by [Yaroslav Klymko](https://github.com/t3hnar). Written in Scala, with a Java wrapper, it presents the Event Store as a system of actors.

For example, from Scala, the following example program connects to an Event Store server and writes events:

```scala
import akka.actor.Status.Failure
import akka.actor.{ ActorLogging, Actor, Props, ActorSystem }
import eventstore._
import eventstore.tcp.ConnectionActor

object WriteEventExample extends App {
  val system = ActorSystem()
  val connection = system.actorOf(ConnectionActor.props())
  implicit val writeResult = system.actorOf(Props[WriteResult])

  val event = EventData("my-event", data = Content("my event data"), metadata = Content("my first event"))

  connection ! WriteEvents(EventStream("my-stream"), List(event))

  class WriteResult extends Actor with ActorLogging {
    def receive = {
      case WriteEventsCompleted(eventNumber) =>
        log.info("eventNumber: {}", eventNumber)
        context.system.shutdown()

      case Failure(e: EsException) =>
        log.error(e.toString)
        context.system.shutdown()
    }
  }
}
```

Although a lot more verbose, this is also usable from Java:

```java
import akka.actor.*;
import akka.event.Logging;
import akka.event.LoggingAdapter;
import eventstore.*;
import eventstore.j.EventDataBuilder;
import eventstore.j.WriteEventsBuilder;
import eventstore.tcp.ConnectionActor;

import java.util.UUID;

public class WriteEventExample {
    public static void main(String[] args) {
        final ActorSystem system = ActorSystem.create();
        final ActorRef connection = system.actorOf(ConnectionActor.getProps());
        final ActorRef writeResult = system.actorOf(Props.create(WriteResult.class));

        final EventData event = new EventDataBuilder("my-event")
                .eventId(UUID.randomUUID())
                .data("my event data")
                .metadata("my first event")
                .build();

        final WriteEvents writeEvents = new WriteEventsBuilder("my-stream")
                .addEvent(event)
                .expectAnyVersion()
                .build();

        connection.tell(writeEvents, writeResult);
    }


    public static class WriteResult extends UntypedActor {
        final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

        public void onReceive(Object message) throws Exception {
            if (message instanceof WriteEventsCompleted) {
                final WriteEventsCompleted completed = (WriteEventsCompleted) message;
                final EventNumber.Exact eventNumber = completed.firstEventNumber();
                log.info("eventNumber: {}", eventNumber);
            } else if (message instanceof Status.Failure) {
                final Status.Failure failure = ((Status.Failure) message);
                final EsException exception = (EsException) failure.cause();
                log.error("reason: {}, message: {}", exception.reason(), exception.message());
            } else
                unhandled(message);

            context().system().shutdown();
        }
    }
}
```

###Akka.Persistence

Also available to make use of the Akka client is an adapter for [Akka.Persistence](http://doc.akka.io/docs/akka/2.3.3/scala/persistence.html), which can be found in the [EventStore/EventStore.Akka.Persistence](https://github.com/EventStore/EventStore.Akka.Persistence) repository. This allows event sourced actors where the journal is stored in an Event Store database.

By default, Akka serialized events as binary, but there is an adapter to use JSON serialization if you want to use the projections system built into Event Store.

###Java API

One of the largest open source contributions we've had to date is from [Stanislavas Didenko](https://github.com/valdasraps) in Lithuania, who published a pure Java client API as open source during his evaluation of Event Store for a project. The repository is at [Valdasraps/esj](https://github.com/valdasraps/esj) on GitHub.

The API looks perhaps more familiar to Java developers who are not also familiar with Akka - for example the following snippet writes events:

```java
import net.eventstore.client.EventStore;
import net.eventstore.client.model.Message;
...
EventStore es = new EventStore(InetAddress.getByName(HOSTNAME), PORTNUMBER);
...
es.appendToStream(STREAM_NAME, new ResponseReceiver() {
    @Override
    public void onResponseReturn(Message msg) {
        // do something
    },
    @Override
    public void onErrorReturn(Exception ex){
        // do something
    }
},EVENT);
...
es.close();
```