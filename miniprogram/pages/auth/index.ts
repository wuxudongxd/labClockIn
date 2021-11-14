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
  data: {
    isLoading: true,
  },

  onLoad() {
    this.checkUserStatus();
  },
  async getUserProfile() {
    try {
      let res = await wx.getUserProfile({
        desc: "获取信息用于验证",
      });
      console.log(res.userInfo);
      addUser(res.userInfo);
    } catch (error) {}
  },

  // 检查用户云数据库状态
  async checkUserStatus() {
    wx.showLoading({
      title: "加载中",
    });
    try {
      const res = await wx.cloud.callFunction({ name: "auth" });
      this.setData({
        isLoading: true,
      });
      wx.hideLoading();
      console.log("云函数返回的数据", res);
      switch (res.result) {
        case "unAuth":
          console.log("用户未认证");
          break;
        case "unAudit":
          console.log("用户未审核通过");
          wx.navigateTo({
            url: "/pages/audit/index",
          });
          break;
        case "Auth":
          console.log("用户审核通过");
          wx.switchTab({
            url: "/pages/index/index",
          });
          break;
        default:
          console.log("出现未知错误");
      }
    } catch (error) {
      console.error("云函数调用失败：", error);
    }
  },
});
