import dayjs from "dayjs";
import { cloud, db, command as _ } from "../init";

// 添加用户
const addUser = async (
  event: any,
  _context: any
): Promise<cloudResponse<{ state: "ok" }>> => {
  try {
    const openid = cloud.getWXContext().OPENID;
    const { avatarUrl, nickName, labId, name, studentID } = event.userInfo;
    await db.collection("user").add({
      data: {
        openid,
        name,
        studentID,
        avatarUrl,
        nickName,
        isAudit: false,
        isDel: false,
      },
    });
    await db.collection("user_lab").add({
      data: {
        userOpenId: openid,
        labId,
        joinTime: dayjs().valueOf(),
      },
    });
    return { state: "ok" };
  } catch (error) {
    return { error: error as Error };
  }
};

export default addUser;
