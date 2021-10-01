#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  VERSION,
  TsTest,
  // sinon,
}               from '../src/mod.js'

test('test', async t => {
  t.ok(VERSION, 'ok')
  t.ok(TsTest, 'ok')
})
