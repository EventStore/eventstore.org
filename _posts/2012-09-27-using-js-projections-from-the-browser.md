---
title: "Using JS projections from the browser"
date: 2012-09-27T14:03Z
author: "Greg Young"
layout: blog-post
category: 'Tutorials'
---

One of the main use cases we had for using Javascript as our query language was the the same code could be hosted in a browser. You can see a more in depth example of this in the "Event store chat example" that is reachable from the main screen in the management console.

Sometimes code speaks 1000 words.

```html
<!doctype html>
<html>
    <head>
        <title>Simple Chat</title>
        <script src="lib/jquery/jquery-1.8.0.min.js"></script>
        <script src="js/projections/v8/Prelude/Modules.js"> </script>
        <script src="js/projections/v8/Prelude/Projections.js"> </script>
        <script src="js/projections/es.projections.environment.js"> </script>
        <script src="js/projections/v8/Prelude/1Prelude.js"> </script>
        <script src="js/projections/es.projection.js"> </script>
        <script src="js/projections/es.api.js"> </script>
    </head>
    <body>

        <input type="text" class="username" value="Input Your Name Here"/>
        <input type="text" class="message-input" value="Your Message"/>
        <div class="chat-window"></div>

        <script>
            $(function () {
                $(".username").focus();

                es.projection({
                    body: function () {
                        fromStream('simplest-chat').when({
                            'ChatMessage': function (state, event) {
                                return { "chatEntry": ("> " + event.body.sender + ": " + event.body.message) };
                            }
                        });
                    },
                    onStateChange: function (stateStr) {
                        var stateObj = JSON.parse(stateStr);
                        $("<div>").text(stateObj.chatEntry).prependTo(".chat-window");
                    }
                });

                $(".message-input").keypress(function (e) {
                    if (e.which !== 13) return;

                    es.postEvent({
                        data: {
                            sender: $('.username').val(),
                            message: $('.message-input').val()
                        },
                        stream: 'simplest-chat',
                        eventType: 'ChatMessage',
                        success: function () {
                            $('.message-input').val("");
                        }
                    });
                });
            });
        </script>
    </body>
</html>
```