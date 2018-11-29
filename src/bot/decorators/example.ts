import log from "../helpers/logger";
import Performances from '../classes/Performances';

// target - Either the constructor function of the class for a static member or the prototype of the class for an instance member.
// key - The name of the member.
// descriptor - The Property Descriptor for the member.
// function
export function test(target: any, key: string, descriptor: any) {
  const originalMethod = descriptor.value;

  // tslint:disable-next-line:space-before-function-paren
  descriptor.value = function () {
    // this = this from function running

    log(`${key} was called`, target, this);
    const result = originalMethod.apply(this, arguments);
    return result;
  };

  return descriptor;
}

export function PerformanceTest() {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {

      constructor(...args: any[]) {
        Performances.start(constructor.name)

        super(...args)

        Performances.end(constructor.name, 1)
      }

    }
  }
}
