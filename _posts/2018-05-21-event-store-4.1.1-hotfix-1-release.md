---
title: "Event Store 4.1.1 Hotfix 1"
author: "Shaan Nobee"
layout: blog-post
category: 'Release Notes'
---

We have released a hotfix for Event Store 4.1.1 to fix the following issue:
https://github.com/EventStore/EventStore/issues/1627

You can download the hotfix for:
- Windows (via Chocolatey)
- Ubuntu 18.04 (via packagecloud)
- Ubuntu 16.04 (via packagecloud)
- Ubuntu 14.04 (via packagecloud)

**Issue:**  
Due to a misconfiguration, logs are written synchronously in version 4.1.1

**Event Store versions affected:**  
4.1.1 only  

**Operating system:**  
Any  

**Impact:**  
- Nodes may become unresponsive during high load  
- Performance drops have been reported  

We would like to thank [@GojiSoft](https://github.com/GojiSoft) for reporting this issue and [@snakefoot](https://github.com/snakefoot) for proposing a fix.

## Event Store 4.1.1 Hotfix release notes

### Event Store Server

- [#1628](https://github.com/EventStore/EventStore/pull/1628) - **(All Platforms)** - Fix asyncwrapper misconfiguration in log.config (causing synchronous logging)
