#!/usr/bin/env sh

publish_to_azure() {
  func azure functionapp publish toxicitycheck;
}

cd api && \
npm --loglevel=error install && \
npm --loglevel=error run build:production && \
publish_to_azure;
