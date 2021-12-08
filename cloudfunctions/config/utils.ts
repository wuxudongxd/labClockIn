// 自定义每个task的name
export const withTaskName = <T>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name });
