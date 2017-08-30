Included with the binary release of Event Store is a small query tool that can be used to execute queries. This tool is called "esquery". 

Esquery is a basic REPL tool that can be used with projections and is used heavily in the documentation of projections.

There are two basic modes for using esquery. The first is to type commands manually into it. When you enter an empty line it will try to run the command (commands can be multiple lines which is very useful for formatting projections). 

```
es :> help
```

A secondary usage is to pipe to it. This can be done in linux or at a windows command prompt

```
cat foo > esquery
```

```
type foo | esquery
```

All documentation in regard to projections can be copy and pasted into a file to use with esquery

##Commands##

###Help###
The ```help``` lists the commands that are available within esquery

###Append###
The ```append``` command appends an event provided to the stream given.

```
es:> append foo EventType {event : "data"}
```

The syntax is ```append {name of stream} {event type} {event data}```

###Subscribe###
The ```subscribe``` command creates a subscription for the given stream that prints events as they get appended to a stream. This operation is useful for simple debugging purposes.

```
es:> subscribe stream
```

###Query###
The ```query``` or ```q``` command executes a query on the Event Store. Queries are written in javascript. The language used here is the same language that is used within the projections library.

es:> query fromStream("foo").when(....)

When using the query operation it is quite useful to write the query on multiple lines.

```
es:> query
fromAll()
	.when({
		$init: function() {
			return {
				count: 0
			};
		},
		$any: function(s, e) {
			s.count = s.count + 1;
			return s;
		}
	})
```

In interactive mode you can press escape to halt the running of a query.

![Google analytics pixel](https://gaproxy-1.apphb.com/UA-40176181-1/Wiki/esquery)
