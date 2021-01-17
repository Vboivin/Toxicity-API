#!/usr/bin/env sh

publish_to_azure() {
  func azure functionapp publish toxicitycheck;
}

cd api && \
sudo npm i -g azure-functions-core-tools@3.0.3233
npm --loglevel=error install && \
npm --loglevel=error run build:production && \
publish_to_azure;
