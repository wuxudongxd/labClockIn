import type { userProps } from "../types/index";

const db = wx.cloud.database();

// 新增用户
export const addUser = async (userInfo: userProps) => {
  const { avatarUrl, nickName, lab, name, studentID } = userInfo;
  return await db.collection("user").add({
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
};

// 查询所有实验室
export const getLabs = async () => await db.collection("lab").get();
