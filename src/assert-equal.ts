/**
 * Huan(202109): #18 - `dts` package conflict node_modules/.bin/tsc version
 *  https://github.com/huan/sidecar/issues/18
 *
 *  Testing static types in TypeScript
 *    https://2ality.com/2019/07/testing-static-types.html
 */
type AssertEqual<T, Expected> =
  [T] extends [Expected]
    ? ([Expected] extends [T] ? true : never)
    : never

export type {
  AssertEqual,
}
