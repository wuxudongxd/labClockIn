import cloud from "wx-server-sdk";

cloud.init({
  env: "lab-clock-in-8g1unwf8651fda4d",
});

const db = cloud.database();
const command = db.command;
const aggregate = db.command.aggregate;

export async function main(event, context) {
  const wxContext = cloud.getWXContext();

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  };
}
