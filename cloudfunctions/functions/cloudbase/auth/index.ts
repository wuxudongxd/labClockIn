import { cloud, db, command as _ } from "../init";

const auth = async (
  _event: any,
  _context: any
): Promise<cloudResponse<{ AuthStatus: AuthStatus }>> => {
  const openid = cloud.getWXContext().OPENID;
  let AuthStatus: AuthStatus = "unAuth";
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
    return { error: error as Error };
  }
  return { AuthStatus };
};

export default auth;
