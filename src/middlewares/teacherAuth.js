const { teacherTokenValidator } = require("../utils/teacherTokenManager");

const teacherAuth = (req, res, next) => {
  const { jwt = "" } = req.cookies;
  const user = teacherTokenValidator(jwt);
  // console.log(req);
  if (user.sub === "teacher" || user.sub === "admin") {
    req.user = user;
    next();
  } else {
    res.redirect("/teacher/login");
  }
};

module.exports = teacherAuth;
