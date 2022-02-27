#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { throttleTime } from 'rxjs'

import { test }             from './tap.js'
import { testSchedulerRunner } from './test-scheduler-runner.js'

test('RxJS testSchedulerRunner: throttleTime demo testing', testSchedulerRunner(helpers => {
  const time = 200
  const operation = throttleTime(time, undefined, { trailing: true })
  const actual   = 'abcdef'
  const expected = '200ms f'

  helpers.expectObservable(
    helpers.cold(actual).pipe(operation),
  ).toBe(expected)
}))
