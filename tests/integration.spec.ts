#!/usr/bin/env ts-node

import {
  test,
  VERSION,
  TsTest,
  // sinon,
}               from '../src/mod'

test('test', async t => {
  t.ok(VERSION, 'ok')
  t.ok(TsTest, 'ok')
})
