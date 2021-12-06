import { GetDistance } from "../../utils/index";

/**
 * 检查用户是否对位置进行授权
 */
const checkLocationAuth = async () => {
  const setting = await wx.getSetting();
  return setting.authSetting["scope.userLocation"];
};

Page({
  data: {
    // 用户信息
    latitude: 0,
    longitude: 0,
    distance: 0,
    locationAuth: false,
    inRange: false,

    // 实验室信息
    labName: "",
    labLatitude: 0,
    labLongitude: 0,
    labRange: 0,

    // 签到信息
    clockInState: "",
    clockInTime: "",
  },
  async onLoad() {
    // 获取实验室信息
    this.getUserLab();

    const response = await wx.cloud.callFunction({
      name: "cloudbase",
      data: { type: "checkClockIn" },
    });
    const result = response.result as AnyObject;

    if (result.message === "unClockIn") {
      // 检查位置权限
      const locationAuth = await checkLocationAuth();
      this.setData({
        clockInState: result.message,
        locationAuth: !!locationAuth, // locationAuth 可能为false或undefined，这里取布尔值
      });
    } else if (result.message === "success") {
      this.setData({
        clockInState: result.message,
        clockInTime: result.data.recordTime,
      });
    } else {
      this.setData({
        clockInState: result.message,
      });
    }
  },
  async onShow() {
    if (await checkLocationAuth()) {
      await wx.startLocationUpdate();
      wx.onLocationChange(this.handleLocationChange);
    }
  },
  async onHide() {
    if (await checkLocationAuth()) {
      wx.offLocationChange(this.handleLocationChange);
    }
  },
  /**
   * 请求用户位置权限
   */
  async getLocationAuth() {
    try {
      const locationAuth = await checkLocationAuth();
      // 用户之前未进行授权
      if (locationAuth === undefined) {
        await wx.authorize({ scope: "scope.userLocation" });
        await wx.startLocationUpdate();
        wx.onLocationChange(this.handleLocationChange);
        this.setData({
          locationAuth: true,
        });
      }
      // 用户之前已拒绝授权
      else if (locationAuth === false) {
        wx.showModal({
          content: "检测到您没打开此小程序的位置权限，是否去设置打开？",
          confirmText: "确认",
          cancelText: "取消",
          success: (res) => {
            //点击“确认”时打开设置页面
            if (res.confirm) {
              wx.openSetting({
                success: async () => {
                  await wx.startLocationUpdate();
                  wx.onLocationChange(this.handleLocationChange);
                  this.setData({
                    locationAuth: true,
                  });
                },
              });
            } else {
              console.log("用户点击取消");
            }
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
  /**
   * 用户地理位置改变handle函数
   */
  handleLocationChange(res: any) {
    let distance = 0;
    let inRange = false;
    if (this.data.labLatitude !== 0 && this.data.labLongitude !== 0) {
      distance = GetDistance(
        this.data.labLatitude,
        this.data.labLongitude,
        res.latitude,
        res.longitude
      );
      inRange = distance < this.data.labRange;
    }
    this.setData({
      latitude: res.latitude.toFixed(9),
      longitude: res.longitude.toFixed(9),
      distance,
      inRange,
    });
  },
  /**
   * 获取用户所在实验室信息
   */
  async getUserLab() {
    const res = await wx.cloud.callFunction({
      name: "cloudbase",
      data: { type: "getUserLab" },
    });

    const labName = (res.result as AnyObject)?.name;
    const { latitude, longitude } = (res.result as AnyObject)?.locations[0];
    const range = (res.result as AnyObject)?.range;
    this.setData({
      labName,
      labLatitude: latitude,
      labLongitude: longitude,
      labRange: range,
    });
  },
  /**
   * 用户签到
   */
  async clockin() {
    try {
      const response = await wx.cloud.callFunction({
        name: "cloudbase",
        data: {
          type: "clockIn",
          data: {
            longitude: this.data.longitude,
            latitude: this.data.latitude,
          },
        },
      });
      const result = response.result as AnyObject;

      this.setData({
        clockInState: result.message,
        clockInTime: result.data.recordTime,
      });
    } catch (error) {
      console.error(error);
    }
  },
});
