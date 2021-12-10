import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";
import { generateResponse } from "../utils";

// 检查用户打卡状态
const checkClockIn = async (_event: any, _context: any) => {
  const openid = cloud.getWXContext().OPENID;
  const res = (await db
    .collection("clock_in_record")
    .where({
      userOpenId: _.eq(openid),
    })
    .orderBy("recordTimeStamp", "desc")
    .get()) as cloud.DB.IQueryResult;

  const nowFormat = dayjs().format("YYYY-MM-DD");
  const records = res.data;
  if (records.length > 0) {
    const { recordTimeStamp } = records[0];
    const recordTime = dayjs(recordTimeStamp);
    let recordDay = recordTime.format("YYYY-MM-DD");

    if (nowFormat === recordDay) {
      // 云函数默认UTC+0，导致本地测试和云端测试时区不一致
      // 尝试过使用dayjs设置默认时区，无效，这里手动增加8小时
      // 总之，fuck you miniprogram
      const recordTimeFormat = recordTime
        .add(8, "hour")
        .format("YYYY年MM月DD日 HH:mm:ss");
      return generateResponse("success", { recordTime: recordTimeFormat });
    }
  }
  return generateResponse("unClockIn");
};

export default checkClockIn;
