const { cloud, db, command: _, aggregate: $ } = require("../init");
const { dateFormat } = require("../utils");

// 检查用户打卡状态
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
  const res = await db
    .collection("clock_in_record")
    .where({
      userOpenId: _.eq(openid),
    })
    .orderBy("recordTime", "desc")
    .get();

  const nowFormat = dateFormat(new Date(), "yyyy-MM-dd");
  const records = res.data;
  if (records.length > 0) {
    const record = records[0];
    const recordTimeFormat = dateFormat(
      new Date(record.recordTime),
      "yyyy-MM-dd"
    );
    if (nowFormat === recordTimeFormat) {
      const recordTime = dateFormat(
        new Date(record.recordTime),
        "yyyy年MM月dd日 hh:mm:ss"
      );
      return { message: "success", data: { recordTime } };
    }
  }
  return { message: "unClockIn" };
};
