#!/usr/bin/env bash
set -e

npm run dist
npm run pack

TMPDIR="/tmp/npm-pack-testing.$$"
mkdir "$TMPDIR"
mv *-*.*.*.tgz "$TMPDIR"
cp tests/fixtures/smoke-testing.ts "$TMPDIR"

cd $TMPDIR
npm init -y
npm install --production \
  *-*.*.*.tgz \
  @types/node \
  is-pr \
  typescript

./node_modules/.bin/tsc \
  --lib esnext \
  --strict \
  --esModuleInterop \
  --noEmitOnError \
  --noImplicitAny \
  --skipLibCheck \
  smoke-testing.ts

node smoke-testing.js
# (for i in {1..3}; do node smoke-testing.js && break || sleep 1; done)
