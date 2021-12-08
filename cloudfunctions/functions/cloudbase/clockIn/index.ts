import { cloud, db, command as _, aggregate as $ } from "../init";
import getUserLab from "../getUserLab/index";
import checkClockIn from "../checkClockIn/index";
import { dateFormat } from "../utils";

// 完成打卡，数据入库
const _clockIn = async (event: any, context: any) => {
  const openid = cloud.getWXContext().OPENID;
  const { longitude, latitude } = event.data;
  const res = await getUserLab(event, context);
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
const clockIn = async (event: any, context: any) => {
  const res = await checkClockIn(event, context);
  if (res.message !== "unClockIn") {
    return res;
  } else {
    try {
      return await _clockIn(event, context);
    } catch (error) {
      return { message: "fail" };
    }
  }
};

export default clockIn;
