---
title: "Easier Development Builds on Unix-like Operating Systems"
author: "James Nugent"
layout: blog-post
category: "Tutorials"
tags: ["Event Store"]
---

A common complaint we've heard about Event Store since it was originally open sourced is that it's complex to make development builds locally - and they were slow - and thus the project was hard to contribute to. As part of our recent work on Event Store v3.1.0 (more on this in another post) we decided to rectify this.

Event Store is primarily written in C#, and builds on Mono on Linux and MacOS and the CLR. However, to support custom projections we have a library named `js1`, which uses the Google V8 JavaScript engine, and consequently have to build that, as well as the interop code which allows us to use it from managed code. 

Being C++, this is platform specific code, so we had to deal with the fact that the standard compiler is different on all of the major platforms we support (GCC on Linux, Clang/LLVM on macOS, and Visual C++ on Windows). V8 imparts its own requirements - it has it's own build system named "gyp" which in turn makes use of Python. On Windows that requires a Unix-like environment in the form of Cygwin.

The Event Store build system has been through a number of iterations. The one in place for the longest used Powershell on Windows and Bash on Linux and macOS, and allowed building the entire codebase including all of the dependencies with a single command, assuming that a C++ compiler, C# compiler, git and Subversion (for V8 and it's dependencies) were available.

Most of the 20 minute plus build was in building V8 and the ICU libraries, however we rarely change the version of V8 we target. Our wrapper code tends only to change when bug fixing (such as the changes in XXXXXXX for const correctness), or when upgrading V8. Consequently we decided to build libjs1 for all of our target platforms and check the resulting binaries into the repository.

This has cut the build time down to seconds, provided you are running either on Ubuntu 14.04 (LTS), Amazon Linux 2015.03, macOS 10.10 or Windows, and means the only dependencies for building are git and either Mono or the CLR build tools. To us this seems like a worthwhile tradeoff for the increased size of the repository - after all cloning is an infrequent operation, and if it is, shallow clones can often be used. As part of this we also dropped support for building binaries for 32-bit CPUs.

# Building on supported platforms

```bash
# Building Event Store from source using a pre-built libjs1
$ git clone https://github.com/EventStore/EventStore
$ cd EventStore
$ ./build.sh [<version=0.0.0.0>] [<configuration=release>] [<distro-platform-override>]
```

The version number must be a full, four part CLR-compatible version number (we use the semantic version number with 0 as the last component). The configuration can be either `debug` or `release`, depending on whether you want the `DEBUG` flag to be defined at build time. The `distro-platform-override` can be used to override the operating system detection which determines the version of `libjs1` which will be used. It will take the form of something like `ubuntu-14.04` or `osx-10.10`.

The output will be produced in `bin/`, relative to the root of the repository, and can either be run directly with Mono, or be statically linked with the Mono framework using the scripts in `scripts/package-mono`.

If you are running an operating system other than Ubuntu 14.04 (LTS), Amazon Linux 2015.03 or macOS 10.10, you will first need to compile `libjs1` - see instructions below.

# Building on unsupported platforms

If you need to build on another platform or are working on code which modifies `libjs1` or upgrades V8, there are scripts which detect the operating system and variant (for Linux and macOS) and ensure the libjs1 binaries end up in the correct place in the build tree. If you need to build for such a platform you still need to meet the dependencies of building V8 - a C++ compiler, subversion and git all on `$PATH`.

## Building `libjs1` on macOS

```bash
$ git clone https://github.com/EventStore/EventStore
$ scripts/build-js1/build-js1-mac.sh
```

The `libjs1.dylib` binary will be built and moved to `src/libs/` directory tree, under the appropriate platform directory.

Once this is complete, the standard build instructions (above) can be used to compile the rest of Event Store.

## Building `libjs1` on Linux

```bash
$ git clone https://github.com/EventStore/EventStore
$ scripts/build-js1/build-js1-linux.sh [werror=no]
```

Setting `werror=no` may be necessary if the version of GCC installed produces warnings as errors whilst compiling V8. The `libjs1.so` binary will be built and moved to `src/libs/` directory tree, under the appropriate platform directory.

Once this is complete, the standard build instructions (above) can be used to compile the rest of Event Store.
