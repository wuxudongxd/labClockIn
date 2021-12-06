const { cloud, db, command: _, aggregate: $ } = require("../init");
const getUserLab = require("../getUserLab/index");
const checkClockIn = require("../checkClockIn/index");

// 完成打卡，数据入库
const clockIn = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
  const { longitude, latitude } = event.data;
  const res = await getUserLab.main(event, context);
  const labId = res._id;
  const recordTime = new Date().getTime();

  await db.collection("clock_in_record").add({
    data: {
      userOpenId: openid,
      labId,
      recordTime,
      longitude,
      latitude,
    },
  });
  return "success";
};

// 用户打卡
exports.main = async (event, context) => {
  const state = await checkClockIn.main(event, context);
  if (state !== "unClockIn") {
    return state.result;
  } else {
    try {
      return await clockIn(event, context);
    } catch (error) {
      return "fail";
    }
  }
};
