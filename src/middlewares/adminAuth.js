const { adminTokenValidator } = require("../utils/adminTokenManager");

const adminAuth = (req, res, next) => {
  const { jwt = "" } = req.cookies;
  const user = adminTokenValidator(jwt);
  if (user.sub === "admin") {
    req.user = user;
    next();
  } else {
    res.redirect("/admin/login");
  }
};

module.exports = adminAuth;
