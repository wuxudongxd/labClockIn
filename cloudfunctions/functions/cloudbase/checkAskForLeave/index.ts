import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";
import { generateResponse } from "../utils";

const checkAskForLeave = async (_event: any, _context: any) => {
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

    let message = "none";
    const records = res.data;
    if (
      records.length > 0 &&
      records[0].startTimeStamp < now &&
      records[0].endTimeStamp > now
    ) {
      message = "audit";
      if (records[0].isAudit) {
        message = "success";
      }
    }

    return generateResponse(message);
  } catch (error) {
    return generateResponse("error", error);
  }
};

export default checkAskForLeave;
