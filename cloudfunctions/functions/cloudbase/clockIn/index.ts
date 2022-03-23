import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";
import getUserLab from "../getUserLab/index";
import checkClockIn from "../checkClockIn/index";

// 完成打卡，数据入库
const _clockIn = async (
  event: any,
  context: any
): Promise<cloudResponse<{ state: clockInState; recordTime?: string }>> => {
  const openid = cloud.getWXContext().OPENID;
  const { longitude, latitude } = event.data;
  const result = await getUserLab(event, context);
  if ("error" in result) {
    throw result.error;
  }
  const labId = result._id;
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
  return { state: "success", recordTime: formatDate };
};

// 用户打卡
const clockIn = async (
  event: any,
  context: any
): Promise<cloudResponse<{ state: clockInState; recordTime?: string }>> => {
  const response = await checkClockIn(event, context);
  try {
    if ("error" in response) {
      throw response.error;
    }
    const { state } = response;
    if (state === "unClockIn") {
      return await _clockIn(event, context);
    }
  } catch (error) {
    return { error: error as Error };
  }
  return response;
};

export default clockIn;
