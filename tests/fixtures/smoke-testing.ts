#!/usr/bin/env ts-node

import {
  test,
  VERSION,
}           from 'tstest'

test('VERSION', async t => {
  t.notEqual(VERSION, '0.0.0', 'should set version to the actual number')
})
