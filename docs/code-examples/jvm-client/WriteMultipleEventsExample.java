package org.eventstore.sample;

import akka.actor.*;
import akka.event.Logging;
import akka.event.LoggingAdapter;
import eventstore.*;
import eventstore.j.EventDataBuilder;
import eventstore.j.SettingsBuilder;
import eventstore.j.WriteEventsBuilder;
import eventstore.tcp.ConnectionActor;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Collection;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import static org.apache.commons.io.FilenameUtils.removeExtension;

public class WriteMultipleEventsExample {
    public static void main(String[] args) {
        final ActorSystem system = ActorSystem.create();
        final Settings settings = new SettingsBuilder()
                .address(new InetSocketAddress("127.0.0.1", 1113))
                .defaultCredentials("admin", "changeit")
                .build();
        final ActorRef connection = system.actorOf(ConnectionActor.getProps(settings));
        final ActorRef writeResult = system.actorOf(Props.create(WriteResult.class));

        final Collection fileList = getAllFilesThatMatchFilenameExtension("/Users/chrisward/Workspace/EventStore/docs.geteventstore.com/code-examples/getting-started", "shoppingCart-*");

        for (Object file : fileList) {
            String streamName = FilenameUtils.getBaseName(removeExtension(file.toString()));
            System.out.println("value= " + streamName);

            JSONParser parser = new JSONParser();
            try {
                JSONArray events = (JSONArray) parser.parse(new FileReader(file.toString()));

                for (Object e : events) {
                    JSONObject event = (JSONObject) e;

                    final EventData json = new EventDataBuilder("json")
                            .eventId(UUID.fromString((String) event.get("eventId")))
                            .jsonData((event.get("data")).toString())
                            .jsonMetadata(event.get("metadata").toString())
                            .build();

                    final WriteEvents writeEvents = new WriteEventsBuilder("newstream")
                            .addEvent(json)
                            .expectAnyVersion()
                            .build();

                    connection.tell(writeEvents, writeResult);
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
    }


    public static class WriteResult extends UntypedActor {
        final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

        public void onReceive(Object message) throws Exception {
            if (message instanceof WriteEventsCompleted) {
                final WriteEventsCompleted completed = (WriteEventsCompleted) message;
                log.info("range: {}, position: {}", completed.numbersRange(), completed.position());
            } else if (message instanceof Status.Failure) {
                final Status.Failure failure = ((Status.Failure) message);
                final EsException exception = (EsException) failure.cause();
                log.error(exception, exception.toString());
            } else
                unhandled(message);

//            context().system().shutdown();
        }
    }

    static Collection getAllFilesThatMatchFilenameExtension(String directoryName, String extension) {
        File directory = new File(directoryName);
        return FileUtils.listFiles(directory, new WildcardFileFilter(extension), null);
    }
}