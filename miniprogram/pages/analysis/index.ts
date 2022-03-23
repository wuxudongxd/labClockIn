import fetch from "../../utils/fetch";

Page({
  data: {
    // calendar
    defaultDate: new Date().getTime(),
    minDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime(),
    maxDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getTime(),

    // server data
    clockInRecord: {} as {
      count: number;
      days: clockInDays;
    },
    leaveRecord: {},
    clockInTime: "",
    latitude: "",
    longitude: "",
    clockInDay: false
  },
  async onLoad() {
    const { clockInRecord, leaveRecord } = await fetch<analysisResponse>(
      "analysis"
    );
    this.setData({
      clockInRecord,
      leaveRecord,
      formatter: function (day: any) {
        if (clockInRecord.days[day.text]) {
          day.bottomInfo = ".";
        }
        return day;
      },
    });
    this.select({ detail: this.data.defaultDate });
  },
  select(event: any) {
    const day = new Date(event.detail).getDate();
    const clockInDay = this.data.clockInRecord.days[day];
    this.setData({
      clockInTime: clockInDay ? `签到：${clockInDay.time}` : "未签到",
      latitude: clockInDay ? clockInDay.latitude : "",
      longitude: clockInDay ? clockInDay.longitude : "",
      clockInDay: !!clockInDay
    });
  },
  navigateToDetail() {
    console.log("navigateToDetail");
    wx.navigateTo({
      url: "/pages/analysis/detail/index",
    });
  },
});
