import auth from "./auth";
import addUser from "./addUser/index";
import getUserLab from "./getUserLab/index";
import clockIn from "./clockIn/index";
import checkClockIn from "./checkClockIn/index";
import askForLeave from "./askForLeave/index";
import checkAskForLeave from "./checkAskForLeave/index";
import analysis from "./analysis";

export async function main(event: any, context: any) {
  switch (event.type) {
    case "auth":
      return await auth(event, context);
    case "addUser":
      return await addUser(event, context);
    case "getUserLab":
      return await getUserLab(event, context);
    case "clockIn":
      return await clockIn(event, context);
    case "checkClockIn":
      return await checkClockIn(event, context);
    case "askForLeave":
      return await askForLeave(event, context);
    case "checkAskForLeave":
      return await checkAskForLeave(event, context);
    case "analysis":
      return await analysis(event, context);
  }
  // return uiil.generateResponse("ok", {});
}
