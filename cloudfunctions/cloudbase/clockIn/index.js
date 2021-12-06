const { cloud, db, command: _, aggregate: $ } = require("../init");
const getUserLab = require("../getUserLab/index");
const checkClockIn = require("../checkClockIn/index");
const { dateFormat } = require("../utils");

// 完成打卡，数据入库
const clockIn = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
  const { longitude, latitude } = event.data;
  const res = await getUserLab.main(event, context);
  const labId = res._id;
  const now = new Date();
  const timestamp = now.getTime();
  const formatDate = dateFormat(now, "yyyy年MM月dd日 hh:mm:ss");

  await db.collection("clock_in_record").add({
    data: {
      userOpenId: openid,
      labId,
      recordTime: timestamp,
      longitude,
      latitude,
    },
  });
  return { message: "success", data: { recordTime: formatDate } };
};

// 用户打卡
exports.main = async (event, context) => {
  const res = await checkClockIn.main(event, context);
  if (res.message !== "unClockIn") {
    return res;
  } else {
    try {
      return await clockIn(event, context);
    } catch (error) {
      return { message: "fail" };
    }
  }
};
