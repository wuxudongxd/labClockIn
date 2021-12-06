const { cloud, db, command: _, aggregate: $ } = require("../init");

// 聚合查询用户所在的实验室信息
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
  const res = await db
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
    .end();

  return res.list[0];
};
