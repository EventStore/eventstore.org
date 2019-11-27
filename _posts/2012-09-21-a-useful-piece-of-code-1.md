---
title: "A useful piece of code 1"
date: 2012-09-21T09:34Z
author: "Greg Young"
layout: blog-post
category: 'Articles'
---

**Updated November 25th, 2015 to fix broken links to code on GitHub.**

One of the great things about having gone OSS is that we can highlight very useful pieces of code inside of the Event Store that are now available with a [3-Clause BSD license](http://opensource.org/licenses/BSD-3-Clause). In other words pieces of code that are now available for you to use if you want to.

Today let’s take a look at a namespace most people have probably overlooked in the code base: [EventStore.Core.Indexes.Hashes](https://github.com/EventStore/EventStore/tree/master/src/EventStore/EventStore.Core/Index/Hashes).

There are three hash implementations sitting here:

- **[Murmur2Unsafe](https://github.com/EventStore/EventStore/blob/2ccaa5676525e2ebf7e5e8efa1d518732e00759e/src/EventStore.Core/Index/Hashes/Murmur2Unsafe.cs)** – This is an unsafe C# implementation of the version [2 murmur hash](http://en.wikipedia.org/wiki/MurmurHash) Murmur2 gets a shout out to [Davy Landman](http://landman-code.blogspot.com) though we don’t use it at this time.
- **[Murmur3AUnsafe](https://github.com/EventStore/EventStore/blob/2ccaa5676525e2ebf7e5e8efa1d518732e00759e/src/EventStore.Core/Index/Hashes/Murmur3AUnsafe.cs)** – This is an unsafe C# implementation of the version [3a murmurhash](http://en.wikipedia.org/wiki/MurmurHash).
- **[XXHashUnsafe](https://github.com/EventStore/EventStore/blob/2ccaa5676525e2ebf7e5e8efa1d518732e00759e/src/EventStore.Core/Index/Hashes/XXHashUnsafe.cs)** – This is an unsafe C# implementation of the [XXHash](http://code.google.com/p/xxhash).

All three are solid implementations of hash functions. At present we use XXHashUnsafe for the hash inside of the read index.
