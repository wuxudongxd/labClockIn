const db = wx.cloud.database();

// 查询所有实验室
export const getLabs = async () => await db.collection("lab").get();
