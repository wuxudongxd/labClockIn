/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
    [key: string]: any;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
  [key: string]: any;
}
