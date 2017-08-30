## Prerequisites ##
1. Windows Azure account
2. Basic knowledge of create virtual machine on Azure
3. Basic knowledge of Linux

## Create a new Linux Virtual Machine ##

This guideline is using a small instance of Ubuntu Server 14.04 LTS virtual machine.

![Create VM](http://i.imgur.com/p3hqfmg.png)

The DNS name in this part is important, please write it down as you are going to use it later.

### Edit Endpoints ###

By default, new virtual machine only setup an endpoint for SSH. You need to add two new entries for EventStore, TCP port `2113` and `1113`.

![Endpoints](http://i.imgur.com/FOUyip8.png)

### Add eventStore user and group ###
Use the following commands to add an user and a group called __eventStore__

```bash
sudo groupadd eventStore
sudo useradd -m -g eventStore -s /bin/bash eventStore
passwd evenStore
```

### Attach a data drive ###
If you want to persist EventStore data, it is recommended to add a new data disk to the virtual machine. The following guideline should help you in this situation: [http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-how-to-attach-disk/](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-how-to-attach-disk)

After following the guideline, you should end up with a mount `/datadrive`

Grant yourself the permission and create two new directories here:

```bash
sudo mkdir -p /datadrive/eventStore/db
sudo mkdir -p /datadrive/eventStore/logs
sudo chown -R eventStore:eventStore /datadrive
```
## Install Nginx ##
Nginx will be used as a reverse proxy server to proxy traffics between client and event store. 

1. Install Nginx:
   ```bash
   sudo apt-get install nginx
   ```

2. Delete nginx default config
   ```bash
   sudo rm /etc/nginx/sites-available/default
   sudo rm /etc/nginx/sites-enabled/default
   ```

3. Create the logging directory
   ```bash
   sudo mkdir -p /var/log/www/get-event-store/log/
   ```

4. Create an `get-event-store` config file with following content in `/etc/nginx/sites-available/` directory:
   ```
  server {
      listen 80;
      server_name get-event-store.cloudapp.net;

      access_log /var/log/www/get-event-store/log/nginx.access.log;
      error_log /var/log/www/get-event-store/log/nginx.error.log;

      location / {
          proxy_pass http://127.0.0.1:2113;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $remote_addr;
      }
  }
  ```

5. Link the config file created to sites-available:
   ```bash
   sudo ln -s /etc/nginx/sites-available/get-event-store /etc/nginx/sites-enabled/get-event-store
   ```
6. Verify configuration and reload
   ```bash
   sudo nginx -t
   sudo service nginx reload
   ```

## Install EventStore release binaries ##
### Install required packages ###
After establishing a SSH connection, we need to install the following packages:

```bash
sudo apt-get install gcc
```

### Install binaries ###
1. Download EventStore Binaries
   ```bash
   su - eventStore
   cd /datadrive
   wget https://eventstore.org/downloads//EventStore-OSS-Linux-v3.0.0.tar.gz
   tar -xzvf EventStore-OSS-Linux-v3.0.0.tar.gz
   rm EventStore-OSS-Linux-v3.0.0.tar.gz
   cd EventStore-OSS-Linux-v3.0.0
   ```

2. Update EvenStore configuration. Fire up your favourite editor and create a __eventStore.config__ with following content:
   ```yaml
   #Database and logs path
   Db: /datadrive/eventStore/db
   Log: /datadrive/eventStore/logs

   #Run all projections
   RunProjections: All
   ```

### Start EventStore ###
Create `/etc/init/event-store.conf` with following content:
```bash
description "Event Store"

start on (filesystem and net-device-up eth0)
stop on runlevel [!2345]

# Path to Event Store installation
env EVENTSTORE_DIR='/datadrive/EventStore-OSS-Linux-v3.0.0/'

# Path to Event Store Configuration file
env EVENTSTORE_CONFIG='/datadrive/EventStore-OSS-Linux-v3.0.0/eventStore.config'

# Path to v8 and js1
env LD_LIBRARY_PATH='/datadrive/EventStore-OSS-Linux-v3.0.0/'

# Name (and local user) to run Hubot as
#setuid eventStore

# Keep the process alive, limit to 5 restarts in 60s
respawn
respawn limit 5 60

# Start
chdir /datadrive/EventStore-OSS-Linux-v3.0.0
exec ${EVENTSTORE_DIR}clusternode
```

Then issue command `sudo start event-store`

Now visit `http://your_dns/` and you should see the EvenStore admin interface. Enjoy the new UI!