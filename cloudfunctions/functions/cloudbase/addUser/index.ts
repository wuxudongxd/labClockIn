import { cloud, db, command as _ } from "../init";
import { generateResponse } from "../utils";

// 添加用户
const addUser = async (event: any, context: any) => {
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
        joinTime: new Date().getTime(),
      },
    });
    return generateResponse("success");
  } catch (error) {
    return generateResponse("error", error);
  }
};

export default addUser;
