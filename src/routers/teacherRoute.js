const express = require("express");
const { Teacher } = require("../models/Teachers");
const { Student } = require("../models/Students");
const { Admin } = require("../models/Admins");
const { compareHash } = require("../utils/hash");
const teacherAuth = require("../middlewares/teacherAuth");
const {
  teacherTokenGenerator,
  teacherTokenValidator
} = require("../utils/teacherTokenManager");
const teacherRouter = express.Router();
teacherRouter
  .route("/login")
  .get((req, res) => {
    res.render("login", {
      layout: "login",
      path: "teacher"
    });
  })
  .post((req, res) => {
    const { email = "", password = "" } = req.body;
    Teacher.findOne({
      where: {
        email
      }
    })
      .then(teacherInstance => {
        if (teacherInstance) {
          const teacher = teacherInstance.get();
          const {
            id = "",
            email: emailFromDB = "",
            firstName = "",
            lastName = "",
            password: passwordFromDb = ""
          } = teacher;
          compareHash(password, passwordFromDb)
            .then(isSuccess => {
              if (isSuccess) {
                const jwtToken = teacherTokenGenerator({
                  id,
                  email: emailFromDB,
                  firstName,
                  lastName
                });
                res.cookie("jwt", jwtToken, { httpOnly: true });
                res.redirect("/teacher/profile/" + id);
              } else {
                res.status(500).send("No teacher found");
              }
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Internal Server Error");
            });
        } else {
          res.status(400).send("No teacher user");
        }
      })
      .catch(err => console.error);
  });

teacherRouter.route("/profile/:id").get(teacherAuth, (req, res) => {
  Student.findAll({ where: { teacherId: req.params.id } }).then(
    studentInstance => {
      const studentGrp = studentInstance.map(instance => instance.get());
      res.render("teacherProfile", {
        layout: "login",
        studentGrp,
        teacherID: req.params.id
      });
    }
  );
});

teacherRouter.route("/remove/:id").get(teacherAuth, (req, res) => {
  // Student.findAll({ where: { teacherId: req.params.id } }).then(
  //   console.log(res)
  // );
  Teacher.destroy({ where: { id: req.params.id } });
  res.redirect("/admin/profile");
});

teacherRouter.route("/logout").get((req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = teacherRouter;
