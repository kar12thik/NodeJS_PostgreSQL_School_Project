const express = require("express");
const indexRouter = express.Router();

indexRouter.route("/").get((req, res) => {
  res.render("home", {
    layout: "hero"
  });
});

module.exports = indexRouter;
