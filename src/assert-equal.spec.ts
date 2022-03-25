#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from './mod.js'

import type { AssertEqual } from './assert-equal.js'

test('AssertEqual smoke testing', async (t) => {
  type T = string
  type EXPECTED_TYPE = string
  const typeTest: AssertEqual<T, EXPECTED_TYPE> = true

  t.ok(typeTest, 'should pass the typing test')
})

/**
 * Issue #37
 *  @link https://github.com/huan/tstest/issues/37
 */
test('AssertEqual with `never`', async (t) => {
  type T = never
  type EXPECTED_TYPE = never
  const typeTest: AssertEqual<T, EXPECTED_TYPE> = true

  t.ok(typeTest, 'should pass the typing test')
})
