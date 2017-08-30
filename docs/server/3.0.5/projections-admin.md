---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Projections Administration"
section: "Server"
version: 3.0.5
---

**Note - projections are a beta feature and are unsupported. They are known to contain some bugs.**

## Running Event Store with projections

Since projections are a beta feature, user projections are disabled by default; instead only system projections run. In order to enable them, ensure the flag `--run-projections=all` is passed to Event Store either via the command line or via a cofiguration file.

## Enabling all projections

Even when projections are running in `user` or `system` mode, it is necessary to selectively enable the projections you wish to run, with the exception of the `$users` projection which is enabled by default. Opting in is the default as running many projections leads to write amplification.

The following script can be used to enable all system projections, for example during tests:

```bash
#!/usr/bin/env bash

SERVER=127.0.0.1:2113
BASICAUTH=admin:changeit

projections=(
  "%24by_category"
  "%24by_event_type"
  "%24stream_by_category"
  "%24streams"
)

for name in "${projections[@]}"; do
    curl -i -X POST -d '{"msgTypeId":251,"name":"${name}"}' http://${SERVER}/projection/${name}/command/enable -u ${BASICAUTH}
done
```
