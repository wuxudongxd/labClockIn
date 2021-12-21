Page({
  TapClockIn() {
    wx.navigateTo({
      url: "/pages/clockin/index",
    });
  },
  TapLeave() {
    wx.navigateTo({
      url: "/pages/leave/index",
    });
  },
  TapAnalysis() {
    wx.navigateTo({
      url: "/pages/analysis/index",
    });
  },
});
