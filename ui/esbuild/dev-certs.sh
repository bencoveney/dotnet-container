#!/bin/bash

cd "$(dirname "$0")"

if [ ! -f ./certs/localhost.crt ]; then
  mkdir -p ./certs

  openssl req -x509 -days 365 -out ./certs/localhost.crt -keyout ./certs/localhost.key \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' -extensions EXT -config <( \
    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
else
  echo "Certs already found"
fi

echo "
You will need to install the dev certs on your machine.

If you are using WSL, you can probably do this by running this command in an admin powershell:
Import-Certificate -FilePath $(wslpath -w ./certs/localhost.crt) -CertStoreLocation Cert:\LocalMachine\Root"
