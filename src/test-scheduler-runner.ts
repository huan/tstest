import {
  RunHelpers,
  TestScheduler,
}                     from 'rxjs/testing'

import type { TestClass } from './tap.js'

const testSchedulerRunner = (callback: (helpers: RunHelpers) => void) => async (t: TestClass) => {
  const testScheduler = new TestScheduler((actual, expected) => {
    t.equal(actual.length, expected.length, 'should have same number of events')

    /**
     * Huan(202203): the test must contains at least one events
     */
    t.not(actual.length, 'should has at least one marble events for testing')

    for (let i = 0; i < actual.length; i++) {
      t.same(actual[i], expected[i], `the marbals of actual is ${actual[i].frame}/${actual[i].notification.kind}:${JSON.stringify(actual[i].notification.value)}`)
    }
  })
  testScheduler.run(callback)
}

export {
  testSchedulerRunner,
}
