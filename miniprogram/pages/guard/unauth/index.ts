const db = wx.cloud.database();

// 新增用户
const addUser = (userInfo: WechatMiniprogram.UserInfo) => {
  const { avatarUrl, language, nickName } = userInfo;
  try {
    const res = db.collection("user").add({
      data: {
        avatarUrl,
        language,
        nickName,
        isAudit: false,
        isDel: false,
      },
    });
    console.log(res);
    wx.switchTab({
      url: "/pages/index/index",
    });
  } catch (error) {
    console.error(error);
  }
};

Page({
  data: {},
  onLoad() {},
  async getUserProfile() {
    try {
      let res = await wx.getUserProfile({
        desc: "获取信息用于验证",
      });
      console.log(res.userInfo);
      addUser(res.userInfo);
    } catch (error) {}
  },
});
