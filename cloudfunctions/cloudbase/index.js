const auth = require("./auth/index");
const addUser = require("./addUser/index");
const getUserLab = require("./getUserLab/index");

exports.main = async (event, context) => {
  switch (event.type) {
    case "auth":
      return await auth.main(event, context);
    case "addUser":
      return await addUser.main(event, context);
    case "getUserLab":
      return await getUserLab.main(event, context);
  }
};
