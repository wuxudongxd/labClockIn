import { addUser } from "../../utils/cloudbase";

Page({
  data: {
    isLoading: true,
    userStatus: "",
  },
  onLoad() {
    this.checkUserStatus();
  },
  // 检查用户云数据库状态
  async checkUserStatus() {
    try {
      const res = await wx.cloud.callFunction({ name: "auth" });
      let _userStatus = "";
      _userStatus = "unAuth";
      // switch (res.result) {
      //   case "unAuth":
      //     console.log("用户未认证");
      //     _userStatus = "unAuth";
      //     break;
      //   case "unAudit":
      //     console.log("用户未审核通过");
      //     _userStatus = "unAudit";
      //     break;
      //   case "Auth":
      //     console.log("用户审核通过");
      //     wx.switchTab({
      //       url: "/pages/index/index",
      //     });
      //     break;
      //   default:
      //     console.log("出现未知错误");
      //     break;
      // }
      this.setData({
        isLoading: false,
        userStatus: _userStatus,
      });
    } catch (error) {
      console.error("云函数调用失败：", error);
    }
  },
  // 添加待校验用户
  async addUnAuditUser() {
    try {
      let res = await wx.getUserProfile({
        desc: "获取信息用于验证",
      });
      const user = await addUser(res.userInfo);
      if (user.errMsg === "collection.add:ok") {
        this.setData({
          userStatus: "unAudit",
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
});
