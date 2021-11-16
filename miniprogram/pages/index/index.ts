Page({
  data: {
    latitude: 0,
    longitude: 0,
  },
  async onShow() {
    try {
      const setting = await wx.getSetting();
      if (setting.authSetting["scope.userLocation"]) {
        await wx.startLocationUpdate();
        wx.onLocationChange(this._locationChangeFn);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async onHide() {
    const setting = await wx.getSetting();
    if (setting.authSetting["scope.userLocation"]) {
      wx.offLocationChange(this._locationChangeFn);
    }
  },
  async onTap() {
    try {
      const setting = await wx.getSetting();
      if (!setting.authSetting["scope.userLocation"]) {
        await wx.authorize({ scope: "scope.userLocation" });
        await wx.startLocationUpdate();
        wx.onLocationChange(this._locationChangeFn);
      }
      console.log(this.data.latitude, this.data.longitude);
      wx.cloud.database().collection("clock_in_record").add({
        data: {},
      });
    } catch (error) {
      console.error(error);
    }
  },
  _locationChangeFn(res: any) {
    this.setData({
      latitude: res.latitude,
      longitude: res.longitude,
    });
  },
});
