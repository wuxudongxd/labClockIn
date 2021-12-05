const { cloud, db, command: _, aggregate: $ } = require("../init");
const getUserLab = require("../getUserLab/index");

const openid = cloud.getWXContext().OPENID;
const now = new Date();

// 用户打卡
exports.main = async (event, context) => {
  const state = await checkClockInState();
  if (state === "success") {
    return { state };
  } else {
    await clockIn();
  }

  // 完成打卡，数据入库
  const clockIn = async () => {
    const { longitude, latitude } = event.data;
    const res = await getUserLab.main(event, context);
    const recordTime = now.getTime();

    await db.collection("clock_in_record").add({
      userOpenId: openid,
      labId: res,
      recordTime,
      longitude,
      latitude,
    });
    return "success";
  };
};
