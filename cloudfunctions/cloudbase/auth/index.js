const { cloud, db, command: _ } = require("../init");

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
  let AuthStatus = "unAuth";
  try {
    const result = await db
      .collection("user")
      .where({
        openid: _.eq(openid),
      })
      .field({
        _id: false,
        isAudit: true,
      })
      .get();

    for (const user of result.data) {
      AuthStatus = "unAudit";
      if (user.isAudit) {
        AuthStatus = "Auth";
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return AuthStatus;
};
