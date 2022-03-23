import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";

const checkAskForLeave = async (
  _event: any,
  _context: any
): Promise<cloudResponse<{ state: askForLeaveState }>> => {
  try {
    const openid = cloud.getWXContext().OPENID;
    const now = dayjs().valueOf();
    const res = (await db
      .collection("ask_for_leave_record")
      .where({
        userOpenId: _.eq(openid),
      })
      .orderBy("recordTimeStamp", "desc")
      .get()) as cloud.DB.IQueryResult;

    let state: askForLeaveState = "none";
    const records = res.data;
    if (
      records.length > 0 &&
      records[0].startTimeStamp < now &&
      records[0].endTimeStamp > now
    ) {
      state = "audit";
      if (records[0].isAudit) {
        state = "success";
      }
    }

    return { state };
  } catch (error) {
    return { error: error as Error };
  }
};

export default checkAskForLeave;
