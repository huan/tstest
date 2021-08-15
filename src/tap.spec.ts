#!/usr/bin/env ts-node

import { test } from './tap'

test('test smoke testing', async t => {
  t.ok('test is ok')
})

// test.only('test smoke testing', async t => {
//   t.ok('test is ok')
// })

test.skip('test smoke testing', async t => {
  t.ok('test is ok')
})
