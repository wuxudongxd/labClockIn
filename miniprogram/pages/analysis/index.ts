Page({
  data: {
    date: "",
    show: false,
    timestamps: [1639319824000, 1639416224000],
    minDate: new Date(2010, 0).getTime(),
    maxDate: new Date(2010, 1).getTime() - 1,
    formatter(day: any) {
      day.bottomInfo = ".";
      return day;
    },
  },

  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date: any) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event: any) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  select(value: any) {
    console.log(value);
  },
  navigateToDetail() {
    console.log("navigateToDetail");

    wx.navigateTo({
      url: "/pages/analysis/detail/index",
    });
  },
});
