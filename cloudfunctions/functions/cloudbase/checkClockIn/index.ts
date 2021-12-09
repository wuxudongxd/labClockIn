import { cloud, db, command as _ } from "../init";
import { dateFormat } from "../utils";
import { generateResponse } from "../utils";

// 检查用户打卡状态
const checkClockIn = async (_event: any, _context: any) => {
  const openid = cloud.getWXContext().OPENID;
  const res = (await db
    .collection("clock_in_record")
    .where({
      userOpenId: _.eq(openid),
    })
    .orderBy("recordTime", "desc")
    .get()) as cloud.DB.IQueryResult;

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
      return generateResponse("success", recordTime);
    }
  }
  return generateResponse("unClockIn");
};

export default checkClockIn;
