const express = require("express");
const app = express();
const path = require("path");
const expressHbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const indexRouter = require("./routers/indexRoute");
const adminRouter = require("./routers/adminRoute");
const teacherRouter = require("./routers/teacherRoute");
const studentRouter = require("./routers/studentRoute");

const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.set("trust proxy", 1);
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "./public/images")));
app.use("/css", express.static(path.join(__dirname, "./public/css")));
app.use("/js", express.static(path.join(__dirname, "./public/js")));
app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

const server = app.listen(process.env.PORT, () => {
  console.log("Server has started running ", server.address().PORT);
});
