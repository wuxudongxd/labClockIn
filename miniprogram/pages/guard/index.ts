Page({
  data: {
    isLoading: true,
  },
  onLoad() {
    this.checkUserStatus();
  },
  // 检查用户云数据库状态
  async checkUserStatus() {
    try {
      const res = await wx.cloud.callFunction({ name: "auth" });
      console.log("云函数返回的数据", res);
      this.setData({
        isLoading: false,
      });
      switch (res.result) {
        case "unAuth":
          console.log("用户未认证");
          wx.redirectTo({
            url: "/pages/guard/unauth/index",
          });
          break;
        case "unAudit":
          console.log("用户未审核通过");
          wx.redirectTo({
            url: "/pages/guard/unaudit/index",
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
          break;
      }
    } catch (error) {
      console.error("云函数调用失败：", error);
    }
  },
});
