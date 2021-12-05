const { cloud, db, command: _, aggregate: $ } = require("../init");

const formatDate = (date) => {
  let formatted_date =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  return formatted_date;
};

// 检查用户打卡状态
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
  const res = await db
    .collection("clock_in_record")
    .where({
      userOpenId: _.eq(openid),
    })
    .get();

  const now = new Date();
  const nowFormat = formatDate(now);
  const records = res.data;
  for (const record of records) {
    const recordTimeFormat = formatDate(new Date(record.recordTime));
    if (nowFormat === recordTimeFormat) return "success";
  }
  return "unClockIn";
};
