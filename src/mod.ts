import sinon from 'sinon'
import tap   from 'tap'

import { test }     from './tap.js'
import { TsTest }   from './tstest.js'
import { VERSION }  from './version.js'
import type { AssertEqual } from './assert-equal.js'

export type {
  AssertEqual,
}
export {
  sinon,
  tap,
  test,
  TsTest,
  VERSION,
}
