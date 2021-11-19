// 新增用户
export const addUser = async (userInfo: WechatMiniprogram.UserInfo) => {
  const { avatarUrl, language, nickName } = userInfo;
  const res = await wx.cloud
    .database()
    .collection("user")
    .add({
      data: {
        avatarUrl,
        language,
        nickName,
        isAudit: false,
        isDel: false,
      },
    });
  console.log("add user", res);

  return res;
};

export const getLabInfo = async () => {
  const res = await wx.cloud.database().collection("lab").get();
  console.log("lab info", res);
  return res;
};
