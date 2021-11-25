// 新增用户
import { userProps } from "../types/index";

export const addUser = async (userInfo: userProps) => {
  const { avatarUrl, nickName, lab, name, studentID } = userInfo;
  const res = await wx.cloud
    .database()
    .collection("user")
    .add({
      data: {
        lab,
        name,
        studentID,
        avatarUrl,
        nickName,
        isAudit: false,
        isDel: false,
      },
    });
  console.log("add user", res);

  return res;
};

export const getLabs = async () => {
  const res = await wx.cloud.database().collection("lab").get();
  return res;
};
