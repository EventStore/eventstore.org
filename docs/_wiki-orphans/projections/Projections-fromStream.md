**fromStream** is one of the basic selector operations from the projections query language. fromStream(stream) will return all of the events in a given stream. 

If you run the following in the [esquery tool](esquery) 

```
append foo MyType {'something' : 'data1'}

append foo MyType {'something' : 'data2'}

append foo MyType {'something' : 'data3'}

append foo MyType {'something' : 'data4'}

q fromStream('foo')

```

```
ouro@ouroboros:> cat text | esquery
No server set defaulting to http://127.0.0.1:2113/
es:> append foo MyType {'something' : 'data1'}

Succeeded.
es:> append foo MyType {'something' : 'data2'}

Succeeded.
es:> append foo MyType {'something' : 'data3'}

Succeeded.
es:> append foo MyType {'something' : 'data4'}

Succeeded.
es:> q fromStream('foo')
Query Completed
3@$projections-aedb041b-b4e4-4033-9f82-9f67e8072a9a-result
{
  "something": "data4"
}
2@$projections-aedb041b-b4e4-4033-9f82-9f67e8072a9a-result
{
  "something": "data3"
}
1@$projections-aedb041b-b4e4-4033-9f82-9f67e8072a9a-result
{
  "something": "data2"
}
0@$projections-aedb041b-b4e4-4033-9f82-9f67e8072a9a-result
{
  "something": "data1"
}
```

fromStream assures ordering of the events returned is fully ordered and repeatable.
