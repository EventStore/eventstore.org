---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Reliability"
section: "Introduction"
version: "3.3.0"
---

Reliability needs to be looked at from a holistic perspective. Even though the Event Store treats data transactionally with full durability assurances this will not help you if the hardware on your machine does not support it.

Many consumer grade disks lie about making things durable to appear faster. This is all good until you have a power outage and lose information. Many consumer grade SSDs in particular will lie to you. Windows by default on a client installation will also enable disk caching.

For SSDs the best indicator that a SSD can actually make data durable is the existence of a capacitor on the board that allows the SSD a bit of time after losing power to complete its writes (Intel 320/710 are examples of this. 520 is an example of one to avoid). The same is true for RAID controllers that have a write-back cache and a battery. If you use a RAID controller with a battery back up remember to check occasionally that the battery has power!

These issues do not only affect the Event Store. Others have created great tests to check whether you may be losing data. We recommend running one of [these such tests](http://highperfpostgres.com/disk-plug-pull-testing) against your production environment.

You can also get in and look at the state of your drives very easily on Linux. From a command line type:

```
sudo hdparm -I {drive}
```

For example, `/dev/sda` to see whether caching is enabled on your drive. Be wary though. Just because caching is disabled does not mean that all writes will actually be made fully durable. If you are in Linux you might want to consider adding

```
 /dev/yourdrive {
        write_cache = off
}
```

to your `/etc/hdparm.conf`.

If you are running the clustered version you may wish to allow these unlikely events to happen. The drives will run faster with caching enabled and it is extraordinarily unlikely that would lose three machines at the same time with corruption (providing you don’t plug them all into the same power outlet!). If this were to happen you would just truncate your data and re-replicate from the other nodes. 
