import { cloud, db, command as _ } from "../init";
import { generateResponse } from "../utils";

const checkAskForLeave = async (event: any, _context: any) => {
  try {
    const openid = cloud.getWXContext().OPENID;
    const { leaveType, startTimeStamp, endTimeStamp, reason } = event.userInfo;
    await db.collection("ask_for_leave_record").add({
      data: {
        openid,
        type: leaveType,
        startTimeStamp,
        endTimeStamp,
        reason,
        isAudit: false,
      },
    });
    return generateResponse("audit");
  } catch (error) {
    return generateResponse("error", error);
  }
};

export default checkAskForLeave;
