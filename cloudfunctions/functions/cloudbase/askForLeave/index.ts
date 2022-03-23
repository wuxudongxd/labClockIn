import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";

const askForLeave = async (
  event: any,
  _context: any
): Promise<cloudResponse<{ state: "audit" }>> => {
  try {
    const openid = cloud.getWXContext().OPENID;
    const { leaveType, startTimeStamp, endTimeStamp, reason } =
      event.information;
    const recordTimeStamp = dayjs().valueOf();
    await db.collection("ask_for_leave_record").add({
      data: {
        userOpenId: openid,
        type: leaveType,
        startTimeStamp,
        endTimeStamp,
        reason,
        recordTimeStamp,
        isAudit: false,
      },
    });
    return { state: "audit" };
  } catch (error) {
    return { error: error as Error };
  }
};

export default askForLeave;
