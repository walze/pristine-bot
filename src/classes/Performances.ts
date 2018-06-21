import { performance } from "perf_hooks";

export class Performance {
  constructor(
    public name: string,
    public t0: number,
  ) { }

  public reset() {
    this.t0 = performance.now()
  }

  public end() {
    const diff = Math.round((performance.now() - this.t0) * 1e2) / 1e2
    const string = `|| ${this.name} ran in ${diff} ms`

    console.log(string)

    return string
  }
}

export class Performances {
  public static tests: Performance[] = []

  public static start(name: string) {
    const found = this.tests.find(test => test.name === name)

    if (!found) {
      const newTest = new Performance(name, performance.now());
      this.tests.push(newTest)

      return newTest
    }

    found.reset()
    return found
  }

  public static find(name: string): Performance {
    const test = this.tests.find(item => item.name === name)

    if (test instanceof Performance)
      return test

    throw new Error('Test not found')
  }
}
