import { performance } from 'perf_hooks';

export class Performance {
  constructor(
    public name: string,
    public t0: number,
  ) { }

  public reset() {
    this.t0 = performance.now()
  }

  /**
   * Ends perf test, retuns time in ms
   *
   * @param {(number | false)} [breaks=0] doesn't log if false
   * @returns {number}
   * @memberof Performance
   */
  public end(breaks: number | false = 0): number {
    const diff = Math.round((performance.now() - this.t0) * 1e2) / 1e2
    let string = `|| ${this.name} ran in ${diff} ms`;

    [...Array(breaks)].map(() => string += '\n')

    if (breaks !== false)
      console.log(string)

    return diff
  }
}

/**
 * Used to make Performance Tests
 *
 * @export
 * @class Performances
 */
export default class Performances {
  public static tests: Performance[] = []

  /**
   * Starts a performance test
   *
   * @static
   * @param {string} name
   * @returns
   * @memberof Performances
   */
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

  /**
   * Finds a perf test, errors if not found
   *
   * @static
   * @param {string} name
   * @returns {Performance}
   * @memberof Performances
   */
  public static find(name: string): Performance {
    const test = this.tests.find(item => item.name === name)

    if (test instanceof Performance)
      return test

    throw new Error('Test not found')
  }
}
