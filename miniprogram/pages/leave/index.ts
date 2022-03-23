import fetch from "../../utils/fetch";

const formDate = (date: Date) => {
  return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`;
};

Page({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    // 状态控制
    leaveState: "",
    show: "",

    // 辅助变量
    types: ["事假", "病假"],

    // 表单数据
    _leaveType: "",
    startTime: "",
    _startTimeStamp: 0,
    endTime: "",
    _endTimeStamp: 0,
    _reason: "",
  },
  async onLoad() {
    const { state } = await fetch<{ state: askForLeaveState }>(
      "checkAskForLeave"
    );
    this.setData({
      leaveState: state,
    });
  },
  displayStartTime() {
    this.setData({ show: "start" });
  },
  displayEndTime() {
    this.setData({ show: "end" });
  },
  onClose() {
    this.setData({ show: "" });
  },
  selectStartTime(event: any) {
    const date = event.detail;
    const timestamp = new Date(date).getTime();

    this.setData({
      show: "",
      startTime: formDate(date),
      _startTimeStamp: timestamp,
    });
  },
  selectEndTime(event: any) {
    const date = event.detail;
    const timestamp = new Date(date).getTime();
    this.setData({
      show: "",
      endTime: formDate(date),
      _endTimeStamp: timestamp,
    });
  },
  PickerChange(e: any) {
    const index = e.detail.value;
    this.setData({
      index,
      _leaveType: this.data.types[index],
    });
  },
  onTextAreaInput(e: any) {
    this.setData({ _reason: e.detail.value });
  },
  async onSubmit() {
    const { _leaveType, _startTimeStamp, _endTimeStamp, _reason } = this.data;
    const { state } = await fetch<{ state: "audit" }>("askForLeave", {
      information: {
        leaveType: _leaveType,
        startTimeStamp: _startTimeStamp,
        endTimeStamp: _endTimeStamp,
        reason: _reason,
      },
    });
    this.setData({
      leaveState: state,
    });
  },
});
