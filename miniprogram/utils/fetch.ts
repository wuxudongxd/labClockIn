// const fetch = async <O = null, F = null>(
//   type: string,
//   information?: Object
// ): Promise<{ message: "ok"; data: O } | { message: "fail"; data: F }> => {
//   const response = await wx.cloud.callFunction({
//     name: "cloudbase",
//     data: { type, ...information },
//   });
//   const { message, data } = response.result as cloudResponse<O, F>;
//   if (message === "error") {
//     throw data;
//   }
//   // if (message === "ok") {
//   //   return { message, data };
//   // } else {
//   //   return { message, data };
//   // }
//   // 防止联合类型失效
//   return { message, data } as
//     | { message: "ok"; data: O }
//     | { message: "fail"; data: F };
// };

const fetch = async <T>(type: string, information?: Object) => {
  const response = (await wx.cloud.callFunction({
    name: "cloudbase",
    data: { type, ...information },
  })) as any;
  // 统一处理 error
  if (response.result.error) {
    throw response.result.error;
  }
  return response.result as T;
};

export default fetch;
