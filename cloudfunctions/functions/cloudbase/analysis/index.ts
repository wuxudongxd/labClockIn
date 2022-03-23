import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";

const analysis = async (
  _event: any,
  _context: any
): Promise<cloudResponse<analysisResponse>> => {
  const openid = cloud.getWXContext().OPENID;
  const now = dayjs();
  const curMonthTimeStamp = now.startOf("month").valueOf();
  const nextMonthTimeStamp = now.endOf("month").valueOf();
  console.log(curMonthTimeStamp);

  try {
    const clockInResult = (await db
      .collection("clock_in_record")
      .where(
        _.and([
          {
            userOpenId: _.eq(openid),
            recordTimeStamp: _.gte(curMonthTimeStamp),
          },
          {
            userOpenId: _.eq(openid),
            recordTimeStamp: _.lt(nextMonthTimeStamp),
          },
        ])
      )
      .get()) as cloud.DB.IQueryResult;

    const leaveResult = (await db
      .collection("ask_for_leave_record")
      .where(
        _.and([
          {
            userOpenId: _.eq(openid),
            recordTimeStamp: _.gte(curMonthTimeStamp),
          },
          {
            userOpenId: _.eq(openid),
            recordTimeStamp: _.lt(nextMonthTimeStamp),
          },
        ])
      )
      .get()) as cloud.DB.IQueryResult;

    // console.log("clockInResult", clockInResult.data);
    // console.log("leaveResult", leaveResult.data);
    const clockInDays: clockInDays = [];
    for (const item of clockInResult.data) {
      const date = dayjs(item.recordTimeStamp);
      const day = date.date();
      const time = date.format("HH:mm");
      const latitude = item.latitude;
      const longitude = item.longitude;
      clockInDays[day] = { time, latitude, longitude };
    }

    const analysisResponse: analysisResponse = {
      clockInRecord: {
        count: clockInResult.data.length,
        days: clockInDays,
      },
      leaveRecord: {
        count: leaveResult.data.length,
      },
    };
    console.log("analysisResponse", analysisResponse);

    return analysisResponse;
  } catch (error) {
    return { error: error as Error };
  }
};

export default analysis;
