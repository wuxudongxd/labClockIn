import { cloud, db, command as _ } from "../init";
import { generateResponse } from "../utils";

const auth = async (event: any, context: any) => {
  const openid = cloud.getWXContext().OPENID;
  let AuthStatus = "unAuth";
  try {
    const result = (await db
      .collection("user")
      .where({
        openid: _.eq(openid),
      })
      .field({
        _id: false,
        isAudit: true,
      })
      .get()) as cloud.DB.IQueryResult;

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

  return generateResponse(AuthStatus);
};

export default auth;
