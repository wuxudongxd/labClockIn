const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const command = db.command;
const aggregate = db.command.aggregate;

module.exports = {
  cloud,
  db,
  command,
  aggregate,
};
