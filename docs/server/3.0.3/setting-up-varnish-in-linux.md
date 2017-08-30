---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Setting up Varnish in Linux"
section: "Server"
version: 3.0.3
---

This document provides a brief guide on how to install the Event Store with varnish reverse proxy in a linux environment. For more information on how to properly configure varnish for your requirements, check the [Varnish website](https://www.varnish-cache.org/trac/wiki/Introduction).

A reverse proxy can also be used to limit access to the Event Store without breaking http caching (authenticate to the proxy not to the Event Store itself). Since the Event Store is running http only on the loopback adapter users must enter through the reverse proxy to reach the Event Store. [Ben Clark’s Gist](https://gist.github.com/benclark/2695148) contains a more configured varnish config that includes basic authentication as well as some other niceties such as putting headers on for hits/misses). 

The first thing that we will need to do is to install varnish

```bash
sudo curl http://repo.varnish-cache.org/debian/GPG-key.txt | sudo apt-key add -
echo "deb http://repo.varnish-cache.org/ubuntu/ precise varnish-3.0" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install varnish
```

The next thing to do is to configure varnish.

```bash
sudo vi /etc/default/varnish

```

Edit the section that looks like

```bash
DAEMON_OPTS="-a :80 \
             -T localhost:6082 \
             -f /etc/varnish/default.vcl \
             -S /etc/varnish/secret \
             -s malloc,256m"

```

Replace the port with the port you want to run on. Then

```bash
sudo vi /etc/varnish/default.vcl

Set it to:
backend default {
    .host = "127.0.0.1";
    .port = "2114";
}
```

Finally you would `sudo service varnish restart` to restart varnish and you should be up and running with a reverse proxy. If you want to check out the status of varnish you can check with `varnishstat` from the command line.