---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Setting up SSL on Windows"
section: "Server"
version: "3.9.0"
---

The steps to set up SSL on windows are as follows:

First, create a certificate using powershell, and copy the thumbprint from the output

```
New-SelfSignedCertificate -DnsName geteventstore.com, localhost -CertStoreLocation cert:\CurrentUser\My
```

To trust the new certificate, the certificate has to be imported into the Trusted Root Certification Authorities:

 1. Press `WindowsKey + R`, and enter `certmgr.msc`  
 2. Navigate to Certificates - Current User -> Personal -> Certificates  
 3. Locate the certificate `geteventstore.com`  
 4. Right click on the certificate and click on All Tasks -> Export. Follow the prompts  
 5. Navigate to Certificates - Current User -> Trusted Root Certification Authorities -> Certificates  
 6. Right click on the Certificates folder menu item and click All Tasks -> Import. Follow the prompts  

Start Event Store with the following configuration :

```
CertificateStoreLocation: CurrentUser
CertificateStoreName: My
CertificateThumbPrint: {Insert Thumb Print from Step 1}
CertificateSubjectName: CN=geteventstore.com
ExtSecureTcpPort: 1115
```

Connect to Event Store using the Event Store .NET Client.

```csharp
var settings = ConnectionSettings.Create().UseSslConnection("geteventstore.com", true);

using (var conn = EventStoreConnection.Create(settings, new IPEndPoint(IPAddress.Loopback, 1115)))
{
	conn.ConnectAsync();
}
```