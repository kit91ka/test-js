export default function log(
  target: Object,
  method: string,
  descriptor: PropertyDescriptor,
) {
  let originalMethod = descriptor.value;
  descriptor.value = function (...args: number[]) {
    console.log(args, "log args");
    let returnValue = originalMethod.apply(this, args);
    if (returnValue) {
      console.log(returnValue);
    }
    return returnValue;
  };
}
