This description is wrong, but it's approximately right:

1. Generate a certificate `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt`
1. Convert to Windows-format: `openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt -certfile CACert.crt`
1. Import into trusted: `certutil -dspublish -f certificate.crt NTAuthCA`
1. In PowerShell find its thumbprint, something like this: `$(ls cert:\ | select-object -first 1).Thumbprint` and use and use that in EventStore