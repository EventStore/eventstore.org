---
title: "Disabling disk caching in Ubuntu"
date: 2013-12-18T12:00Z
author: "James Nugent"
layout: blog-post
---

Amongst the many interesting discussions I had at Build Stuff last week was about how it’s desirable to switch off disk caching for the disks used for Event Store databases to help ensure that data is durable in the face of power failures.

This is actually true of many databases, indeed, postgres gives you a warning about the possible dire consequences of having write caching switched on when you may experience power failure.

You can find out fairly easily whether disk caching is enabled on your disk or not by using the `hdparm` utility, like this:

```
$sudo hdparm -i /dev/sda

Model=INTEL SSDMCEAC060B3, FwRev=LLLi, SerialNo=CVLI303201QK060K
Config={ Fixed }
RawCHS=16383/16/63, TrkSize=0, SectSize=0, ECCbytes=0
BuffType=unknown, BuffSize=unknown, MaxMultSect=16, MultSec=16
CurrCHS=16383/16/63, CurSecs=16514064, LBA=yes, LBAsects=117231408
IORDY=on/off, tPIO={min:120,w/IORDY:120}, tDMA={min:120,rec:120}
PIO modes:  pio0 pio3 pio4
DMA modes:  mdma0 mdma1 mdma2
UDMA modes: udma0 udma1 udma2 udma3 udma4 udma5 udma6
AdvancedPM=yes: unknown setting <strong>WriteCache=enabled</strong>
Drive confirms to: unknown:  ATA/ATAP-2,3,4,5,6,7

* signifies the current active mode
THISDFGJSDGKSJFGNJSDHFGNKSDJFNSJFHGN<ASDFKNSKFGHNSRKNSKDHNFNKXdfHGNDMFHGNDJKFHGSKDJFNDKFGNDKFJGDKFGNDKRGNDFG<JNDcKVUNSKGND<BJNXKGHNDFKGNDFMGJNDFG
```

The important part here is in bold, `WriteCache=enabled`, which is not what we want! To disable the write cache, edit `/etc/hdparm.conf`, and uncomment the second of these two lines so that it looks like this:

```
# -W Disable/enable the IDE drive's write-caching feature
write_cache = off
After a restart, the output of hdparm -i /dev/sda should look like this:

$sudo hdparm -i /dev/sda

Model=INTEL SSDMCEAC060B3, FwRev=LLLi, SerialNo=CVLI303201QK060K
Config={ Fixed }
RawCHS=16383/16/63, TrkSize=0, SectSize=0, ECCbytes=0
BuffType=unknown, BuffSize=unknown, MaxMultSect=16, MultSec=16
CurrCHS=16383/16/63, CurSecs=16514064, LBA=yes, LBAsects=117231408
IORDY=on/off, tPIO={min:120,w/IORDY:120}, tDMA={min:120,rec:120}
PIO modes:  pio0 pio3 pio4
DMA modes:  mdma0 mdma1 mdma2
UDMA modes: udma0 udma1 udma2 udma3 udma4 udma5 udma6
AdvancedPM=yes: unknown setting WriteCache=disabled
Drive confirms to: unknown:  ATA/ATAP-2,3,4,5,6,7

* signifies the current active mode
```

Obviously here you should replace `/dev/sda` with whichever device your database is on!

Note that simply disabling drive caching is actually not enough to ensure that writes are durable – many drives still misbehave (especially the Intel 520 series SSDs)!