import tap from 'tap'

interface Test {
  (...args: Parameters<typeof tap.test>): void
  only: typeof tap.only
  skip: typeof tap.skip
}

const test: Test = (...args: Parameters<typeof tap.test>) => {
  void tap.test(...args)
}

test.only = tap.only
test.skip = tap.skip

export {
  test,
}
