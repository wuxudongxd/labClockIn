import { cloud, db, command as _, aggregate as $ } from "../init";

// 聚合查询用户所在的实验室信息
const getUserLab = async (event: any, context: any) => {
  const openid = cloud.getWXContext().OPENID;
  const res = (await db
    .collection("user_lab")
    .aggregate()
    .match({
      userOpenId: _.eq(openid),
    })
    .lookup({
      from: "lab",
      localField: "labId",
      foreignField: "_id",
      as: "lab",
    })
    .unwind({
      path: "$lab",
    })
    .replaceRoot({
      newRoot: "$lab",
    })
    .project({
      _openid: 0,
    })
    .end()) as cloud.DB.IAggregateResult;

  return res.list[0];
};

export default getUserLab;
