/* 此文件自动生成，请勿手动修改，源文件位于 ..\..\functions\cloudbase */
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var cloud = require("wx-server-sdk");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}

var cloud__default = /*#__PURE__*/ _interopDefaultLegacy(cloud);

cloud__default["default"].init({
  env: "lab-clock-in-8g1unwf8651fda4d",
});

const db = cloud__default["default"].database();
db.command;
db.command.aggregate;

async function main(event, context) {
  const wxContext = cloud__default["default"].getWXContext();

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  };
}

exports.main = main;
//# sourceMappingURL=index.js.map
