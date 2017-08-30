---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Deploy with Puppet"
section: "Server"
version: 3.0.0
---

<span class="note--warning">
Currently applies to Event Store 2.0.0.
</span>

To get started you need an RPM package of Event Store. You can make an [Event Store RPM](https://github.com/haf/fpm-recipes/tree/master/eventstore) on CentOS.

Once you have your package you need to have a Puppet module for automating the deployment. There’s [puppet-eventstore](https://github.com/haf/puppet-eventstore) to do that. It will ensure the package you just created is installed and allow you to give parameters to Event Store.

The module has a dependency on [puppet-supervisor](https://github.com/haf/puppet-supervisor) which is used to run the server, which in turn requires the package [python-supervisor](https://github.com/haf/fpm-recipes/tree/master/python-supervisor). The RPM has a dependency on a [Mono package](https://github.com/haf/fpm-recipes/tree/master/mono).