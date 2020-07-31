export const deepMerge = (target, source) => {
  for (let key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      !source[key].hasOwnProperty("length")
    ) {
      // eslint-disable-next-line
      Object.assign(source[key], deepMerge(target[key] || {}, source[key]));
    }
  }
  // eslint-disable-next-line
  Object.assign(target || {}, source);

  return target;
};