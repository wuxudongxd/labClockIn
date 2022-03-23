import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";

const analysis = async (
  _event: any,
  _context: any
): Promise<cloudResponse<any>> => {
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

    return { clockInResult, leaveResult };
  } catch (error) {
    return { error: error as Error };
  }
};

export default analysis;
