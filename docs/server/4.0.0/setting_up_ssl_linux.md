---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Setting up SSL on Ubuntu 16.04"
section: "Server"
version: "4.0.0"
---

The steps to set up SSL on Ubuntu 16.04 are as follows:

First, create a private key and self-signed certificate request (Note: This is only for testing purposes)

```
openssl req \
  -x509 -sha256 -nodes -days 365 -subj "/CN=eventstore.org" \
  -newkey rsa:2048 -keyout geteventstore.pem -out geteventstore.csr
```

Export a p12 file from the certificate request. This will be used when starting Event Store :

```
openssl pkcs12 -export -inkey geteventstore.pem -in geteventstore.csr -out geteventstore.p12
```

The certificate needs to be added to Ubuntu's trusted certificates. Copy the cert to the `ca-certificates` folder and update the certificates :

```
sudo cp geteventstore.csr /usr/local/share/ca-certificates/geteventstore.crt

sudo update-ca-certificates
```

Mono has its own separate certificate store which needs to be synced with the changes we have made to Ubuntu's certificates.
You will need to install `mono-devel` :

```
sudo apt-get install mono-devel
```

This installs `cert-sync`, which can be used to update mono's certificate store with the new certificate :

```
sudo cert-sync geteventstore.csr
```

Start Event Store with the following configuration :

```
CertificateFile: geteventstore.p12
ExtSecureTcpPort: 1115
```

Connect to Event Store using the Event Store .NET Client.

```csharp
var settings = ConnectionSettings.Create().UseSslConnection("eventstore.org", true);

using (var conn = EventStoreConnection.Create(settings, new IPEndPoint(IPAddress.Loopback, 1115)))
{
    conn.ConnectAsync().Wait();
}
```