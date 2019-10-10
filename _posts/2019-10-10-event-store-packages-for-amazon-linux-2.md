---
layout: blog-post
title: Event Store packages for Amazon Linux 2
author: Arwin Neil Baichoo
---
# Event Store packages for Amazon Linux 2

Event Store Commercial package for Amazon Linux 2 AMI is now available!

#### Changes moving from Amazon Linux 1 to Amazon Linux 2 Packages
---

#### Phasing out support for AWS Auto Scaling groups 
Running Event Store as in AWS EC2 Auto Scaling groups is no more a recommended practice because AGS can end up simultaneously or near simultaneously deleting all instances

To learn more about running Event Store clusters, click [here](https://eventstore.org/docs/server/cluster-with-manager-nodes/index.html).

#### Systemd instead of System V init system
As of Amazon Linux 2, [System V init has been replaced with systemd service and systems manager](https://aws.amazon.com/amazon-linux-2/release-notes/). Event Store is now started using `systemctl` instead of `initctl` 

- Enable Event Store on Startup
```
systemctl enable eventstore
```

- Start Event Store
```
systemctl start eventstore
```

#### Event Store not exposed on external IP by default
Event Store is does not run on external IP by default anymore. Additional configuration is needed to access Event Store on public IP & DNS after opening ports EC2 Security Groups as follows :

```
IntIp: <Private IP>
ExtIp: <Private IP>
IntHttpPort: 2112
ExtHttpPort: 2113
IntTcpPort: 1112
ExtTcpPort: 1113
IntHttpPrefixes: http://*:2112/
ExtHttpPrefixes: http://*:2113/
AddInterfacePrefixes: false
DiscoverViaDns: false
```

Private IP can be fetched using an [Instance Metadata](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) query for scripting this process.

```
PRIVATE_IP=`curl --silent --location http://169.254.169.254/latest/meta-data/local-ipv4`
```
