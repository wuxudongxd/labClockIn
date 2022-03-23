type AuthStatus = "unAudit" | "Auth" | "unAuth";
type clockInState = "unClockIn" | "success" | "prohibit";
type askForLeaveState = "none" | "audit" | "success";

// // 建立映射关系
// type cloudResponsePayload<O, F> = {
//   ok: O;
//   fail: F;
//   error: Error;
// };

// type cloudResponse1<O = null, F = null> = {
//   [T in keyof cloudResponsePayload<O, F>]: {
//     message: T;
//     data: cloudResponsePayload<O, F>[T];
//   };
// }[keyof cloudResponsePayload<O, F>];

type cloudResponse<T> = T | { error: Error };
