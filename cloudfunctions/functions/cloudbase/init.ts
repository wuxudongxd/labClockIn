import cloud from "wx-server-sdk";

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV as any,
});

const db = cloud.database();
const command = db.command;
const aggregate = db.command.aggregate;

export { cloud, db, command, aggregate };
