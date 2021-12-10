import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";
import { generateResponse } from "../utils";
import getUserLab from "../getUserLab/index";
import checkClockIn from "../checkClockIn/index";

// 完成打卡，数据入库
const _clockIn = async (event: any, context: any) => {
  const openid = cloud.getWXContext().OPENID;
  const { longitude, latitude } = event.data;
  const result = await getUserLab(event, context);
  const labId = result.data._id;
  const now = dayjs();
  const timestamp = now.valueOf();
  const formatDate = now.add(8, "hour").format("YYYY年MM月DD日 HH:mm:ss");

  await db.collection("clock_in_record").add({
    data: {
      userOpenId: openid,
      labId,
      recordTimeStamp: timestamp,
      longitude,
      latitude,
    },
  });
  return generateResponse("success", { recordTime: formatDate });
};

// 用户打卡
const clockIn = async (event: any, context: any) => {
  const result = await checkClockIn(event, context);
  if (result.message === "unClockIn") {
    try {
      return await _clockIn(event, context);
    } catch (error) {
      return generateResponse("failed");
    }
  }
  return result;
};

export default clockIn;
