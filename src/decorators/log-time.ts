export default function logTime() {
  return (
    target: Object,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<Function>,
  ) => {
    const method = descriptor.value;
    //@ts-ignore
    descriptor.value = function (...args) {
      let time = +new Date();
      //@ts-ignore
      const result = method.apply(this, args);
      console.log(+new Date() - time);
      return result;
    };
  };
}
