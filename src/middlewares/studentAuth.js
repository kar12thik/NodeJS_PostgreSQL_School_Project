const { studentTokenValidator } = require("../utils/studentTokenManager");

const studentAuth = (req, res, next) => {
  const { jwt = "" } = req.cookies;
  const user = studentTokenValidator(jwt);
  if (
    user.sub === "student" ||
    user.sub === "teacher" ||
    user.sub === "admin"
  ) {
    req.user = user;
    next();
  } else {
    res.redirect("/student/login");
  }
};

module.exports = studentAuth;
