#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  VERSION,
}           from 'tstest'

test('VERSION', async t => {
  t.not(VERSION, '0.0.0', 'should set version to the actual number')
})
