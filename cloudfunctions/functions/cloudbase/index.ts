import auth from "./auth";
import addUser from "./addUser/index";
import getUserLab from "./getUserLab/index";
import clockIn from "./clockIn/index";
import checkClockIn from "./checkClockIn/index";

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
  }
}
