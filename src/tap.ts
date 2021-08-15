import tap from 'tap'

interface Test {
  (...args: Parameters<typeof tap.test>): void
  only: (...args: Parameters<typeof tap.only>) => void
  skip: (...args: Parameters<typeof tap.skip>) => void
}

const test: Test = (...args: Parameters<typeof tap.test>) => {
  void tap.test(...args)
}

test.only = tap.only
test.skip = tap.skip

export {
  test,
}
