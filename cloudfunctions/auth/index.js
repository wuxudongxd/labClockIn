// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: "lab-clock-in-8g1unwf8651fda4d",
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
  let AuthStatus = "unAuth";
  try {
    const result = await db
      .collection("user")
      .where({
        _openid: _.eq(openid),
      })
      .field({
        _openid: true,
        isAudit: true,
      })
      .get();

    for (const user of result.data) {
      AuthStatus = "unAudit";
      if (user.isAudit) {
        AuthStatus = "Audit";
        break;
      }
    }
    console.log(openid, result.data[0], AuthStatus);
  } catch (error) {
    console.error(error);
  }

  return AuthStatus;
};
