import { getLabs } from "../../utils/cloudbase";
import { lab, userProps } from "../../../types/index";
import fetch from "../../utils/fetch";

interface form {
  labIndex: number;
  name: string;
  studentID: string;
}

Page({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    isLoading: true,
    hasUserInfo: false,
    userStatus: "",
    index: null,
    _labs: [] as lab[],
    labsName: [] as string[],
    nickName: "",
    avatarUrl: "",
  },
  async onLoad() {
    this.checkUserStatus();
  },
  // 检查用户云数据库状态
  async checkUserStatus() {
    try {
      const { AuthStatus } = await fetch<{ AuthStatus: AuthStatus }>("auth");
      console.log("AuthStatus", AuthStatus);
      switch (AuthStatus) {
        case "unAuth":
          console.log("用户未认证");
          this.setData({
            userStatus: "unAuth",
          });
          this.getLabsInfo();
          break;
        case "unAudit":
          console.log("用户未审核通过");
          this.setData({
            userStatus: "unAudit",
          });
          break;
        case "Auth":
          console.log("用户审核通过");
          wx.redirectTo({
            url: "/pages/home/index",
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
  // 添加待校验用户
  async onSubmit(event: WechatMiniprogram.FormSubmit) {
    try {
      const formData = event.detail.value as form;
      const selectedLabName = this.data.labsName[formData.labIndex];
      const selectedLab = this.data._labs.find(
        (item) => item.name === selectedLabName
      ) as lab;

      const userProps: userProps = {
        nickName: this.data.nickName,
        avatarUrl: this.data.avatarUrl,
        name: formData.name,
        studentID: formData.studentID,
        labId: selectedLab?._id,
      };

      const { message } = await fetch("addUser", {
        userInfo: userProps,
      });
      if (message === "ok") {
        this.setData({
          userStatus: "unAudit",
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
  async getLabsInfo() {
    const res = await getLabs();
    const labs = res.data as lab[];
    const labsName = labs.map((item: lab) => item.name);

    this.setData({
      _labs: labs,
      labsName,
    });
  },
  PickerChange(e: any) {
    this.setData({
      index: e.detail.value,
    });
  },
  async getUserProfile() {
    try {
      const res = await wx.getUserProfile({
        desc: "获取信息用于验证",
      });
      this.setData({
        nickName: res.userInfo.nickName,
        avatarUrl: res.userInfo.avatarUrl,
        hasUserInfo: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
});
