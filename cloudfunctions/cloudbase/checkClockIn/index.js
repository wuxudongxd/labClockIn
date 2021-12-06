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
    .orderBy("recordTime", "desc")
    .get();

  const nowFormat = formatDate(new Date());
  const records = res.data;
  if (records.length > 0) {
    const record = records[0];
    const recordTimeFormat = formatDate(new Date(record.recordTime));
    if (nowFormat === recordTimeFormat) return "success";
  }

  return "unClockIn";
};
