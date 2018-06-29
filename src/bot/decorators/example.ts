import log from "../helpers/logger";

// target - Either the constructor function of the class for a static member or the prototype of the class for an instance member.
// key - The name of the member.
// descriptor - The Property Descriptor for the member.

export function test(target: any, key: string, descriptor: any) {
  const originalMethod = descriptor.value;

  descriptor.value = function() {
    // this = this from function running

    log(`${key} was called`, target, this);
    const result = originalMethod.apply(this, arguments);
    return result;
  };

  return descriptor;
}
