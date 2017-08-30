When creating projections please remember, that some events are built in (like first one - `$stream-created`)
so if you try to retrieve some values from a stream, you should check that event.body is not null.

Simple projection which counts number of events in stream:

```javascript
fromStream('Contacts').whenAny(
   function(state, e) { 
        if (state.items == null) return {count : 0}; //first event is built in ...
        state.count++;
        return state;
});
```

If you want to look at all events as JSON, you can try extend it:

```javascript
fromStream('Contacts').whenAny(
    function(state, e) { 
        if (state.items == null) return {items : new Array(), count : 0};
        state.items.push(e.body); // if you want view event you can use state.items.push(e);
        state.count++;
        return state;
});
```

You can also use `log('text')` anywhere in your projection code for debugging.  It just outputs the text to the server console (for now). 

`linkTo` (in some googlegroup posts is noted `link_to`)
is used to create new streams, so you can create stream based on some property from your event.
For example if you have property user (for example from chat application) you can use this:

```javascript
fromAll().whenAny( // or fromStream('Contacts').whenAny(
       function(s, e) { 
           linkTo(e.user, e); 
           return null; 
});
```

this projection creates new streams based on event.user property. This stream is then accessible as normal stream: http://127.0.0.1:2113/streams/John?format=json

Please note, that name is case sensitive and this projection must be created as "Persistent", otherwise it will not work