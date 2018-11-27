import * as assert from 'assert'

// import tstest from 'tstest'

const tstest = {
  methodFixture() {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log('@fixture()')
    }
  },
  classFixture() {
    return function (constructor: Function) {
      console.log(constructor.name)
      console.log(constructor.prototype.name)
    }
  },
  parameterFixture() {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      console.log(propertyKey)
      let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || []
      existingRequiredParameters.push(parameterIndex)
      Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey)
    }
  }
}

test('File smoke testing', async t => {
  const file = FileBox.fromLocal('x')
})


@tstest.classFixture()
export class FixtureFileBox {

  @tstest.methodFixture()
  public static localFileFixture() {
    return {
      name: 'test.txt',
      type: 'plain/text',
      size: '1',
      content: 'T',
    }
  }

  public static testFixture() {
    //
  }
}

export class TestFileBox {

  public static testFileCreateLocal(
    @tstest.parameterFixture() localFileFixture: Object
  ): void {
    const file = File.fromLocal(localFileFixture)

    test('File.createLocal()', async t => {
      const file = File.fromLocal('/tmp/test.txt')
    })

    test('File.fromRemote()', async t => {
      const URL = 'http://httpbin.org/response-headers?Content-Type=text/plain;%20charset=UTF-8&Content-Disposition=attachment;%20filename%3d%22test.json%22'
    })

  }

  public static testTest(i: number) {
    //
  }
}

