import tap from 'tap'

function test (...args: Parameters<typeof tap.test>) {
  void tap.test(...args)
}

export {
  test,
}
