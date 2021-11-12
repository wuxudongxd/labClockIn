// 云函数入口文件
import { init, getWXContext } from 'wx-server-sdk'

init()

// 云函数入口函数
export async function main(event, context) {
  const wxContext = getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}