package org.eventstore.sample;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import akka.actor.Status.Failure;
import akka.actor.UntypedActor;
import akka.event.Logging;
import akka.event.LoggingAdapter;
import eventstore.*;
import eventstore.j.ReadEventBuilder;
import eventstore.j.SettingsBuilder;
import eventstore.tcp.ConnectionActor;

import java.net.InetSocketAddress;

public class ReadSingleEventExample {

    public static void main(String[] args) {
        final ActorSystem system = ActorSystem.create();
        final Settings settings = new SettingsBuilder()
                .address(new InetSocketAddress("127.0.0.1", 1113))
                .defaultCredentials("admin", "changeit")
                .build();
        final ActorRef connection = system.actorOf(ConnectionActor.getProps(settings));
        final ActorRef readResult = system.actorOf(Props.create(ReadResult.class));
        
        final ReadEvent readEvent = new ReadEventBuilder("newstream")
                .number(0)
                .resolveLinkTos(false)
                .build();

        connection.tell(readEvent, readResult);
    }


    public static class ReadResult extends UntypedActor {
        final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

        public void onReceive(Object message) throws Exception {
            if (message instanceof ReadEventCompleted) {
                final ReadEventCompleted completed = (ReadEventCompleted) message;
                final Event event = completed.event();
                log.info("event: {}", event);
            } else if (message instanceof Failure) {
                final Failure failure = ((Failure) message);
                final EsException exception = (EsException) failure.cause();
                log.error(exception, exception.toString());
            } else
                unhandled(message);

//            context().system().shutdown();
        }
    }
}