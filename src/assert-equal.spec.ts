#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from './mod.js'

import type { AssertEqual } from './assert-equal.js'

test('AssertEqual smoke testing', async (t) => {
  type T = string
  type EXPECTED_TYPE = string
  const typeTest: AssertEqual<T, EXPECTED_TYPE> = true

  t.ok(typeTest, 'should pass the typing test')
})
