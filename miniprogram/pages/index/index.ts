import { GetDistance } from "../../utils/index";
import { getLabInfo } from "../../utils/cloudbase";

Page({
  data: {
    latitude: 0,
    longitude: 0,
    labName: "",
    labLatitude: 0,
    labLongitude: 0,
    distribute: 0,
  },
  async onShow() {
    try {
      const setting = await wx.getSetting();
      if (setting.authSetting["scope.userLocation"]) {
        await wx.startLocationUpdate();
        wx.onLocationChange(this._locationChangeFn);
      }
      const res = await getLabInfo();
      const labName = res.data[0].name;
      console.log("lab", res.data[0]);

      const { latitude, longitude } = res.data[0].locations[0];
      this.setData({
        labName,
        labLatitude: latitude,
        labLongitude: longitude,
      });
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
    let distance = 0;
    if (this.data.labLatitude !== 0 && this.data.labLongitude !== 0) {
      distance = GetDistance(
        this.data.labLatitude,
        this.data.labLongitude,
        res.latitude,
        res.longitude
      );
    }
    this.setData({
      latitude: res.latitude,
      longitude: res.longitude,
      distance,
    });
  },
});
