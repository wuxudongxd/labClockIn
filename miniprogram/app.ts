/**
 * 初始化云函数调用
 */
const initCloud = () => {
  if (!wx.cloud) {
    console.error("请使用 2.2.3 或以上的基础库以使用云能力");
  } else {
    wx.cloud.init({
      env: "lab-clock-in-8g1unwf8651fda4d",
      traceUser: true,
    });
  }
};

App<IAppOption>({
  globalData: {},
  onLaunch() {
    initCloud();
  },
});
