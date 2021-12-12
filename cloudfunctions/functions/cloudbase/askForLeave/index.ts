import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";
import { generateResponse } from "../utils";

const askForLeave = async (event: any, _context: any) => {
  try {
    const openid = cloud.getWXContext().OPENID;
    const { leaveType, startTimeStamp, endTimeStamp, reason } = event.data;
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
    return generateResponse("audit");
  } catch (error) {
    return generateResponse("error", error);
  }
};

export default askForLeave;
