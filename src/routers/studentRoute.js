const express = require("express");
const { Teacher } = require("../models/Teachers");
const { Student } = require("../models/Students");
const { Admin } = require("../models/Admins");
const { compareHash } = require("../utils/hash");
const studentAuth = require("../middlewares/studentAuth");
const adminAuth = require("../middlewares/adminAuth");
const teacherAuth = require("../middlewares/teacherAuth");
const {
  studentTokenGenerator,
  studentTokenValidator
} = require("../utils/studentTokenManager");
const studentRouter = express.Router();
studentRouter
  .route("/login")
  .get((req, res) => {
    res.render("login", {
      layout: "login",
      path: "student"
    });
  })
  .post((req, res) => {
    const { email = "", password = "" } = req.body;
    Student.findOne({
      where: {
        email
      }
    })
      .then(studentInstance => {
        if (studentInstance) {
          const student = studentInstance.get();
          const {
            id = "",
            email: emailFromDB = "",
            firstName = "",
            lastName = "",
            password: passwordFromDb = ""
          } = student;
          compareHash(password, passwordFromDb)
            .then(isSuccess => {
              if (isSuccess) {
                const jwtToken = studentTokenGenerator({
                  id,
                  email: emailFromDB,
                  firstName,
                  lastName
                });
                res.cookie("jwt", jwtToken, { httpOnly: true });
                res.redirect("/student/profile");
              } else {
                res.status(500).send("No student found");
              }
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Internal Server Error");
            });
        } else {
          res.status(400).send("No student user");
        }
      })
      .catch(err => console.error);
  });

studentRouter.route("/profile/:id").get(studentAuth, (req, res) => {
  Student.findOne({ where: { id: req.params.id } }).then(studentInstance => {
    const studentGrp = studentInstance.get();
    res.render("studentProfile", {
      layout: "login",
      studentGrp
    });
  });
});

studentRouter
  .route("/update/:id")
  .get(teacherAuth, (req, res) => {
    res.render("updateStudentMark", {
      layout: "login",
      studentId: req.params.id
    });
  })
  .post(teacherAuth, (req, res) => {
    let studentData = {
      maths: req.body.maths,
      science: req.body.science,
      social: req.body.social,
      firstLanguage: req.body.firstLanguage,
      secondLanguage: req.body.secondLanguage
    };
    Student.update(studentData, { where: { id: req.params.id } }).then(function(
      student
    ) {
      console.log(student);
      res.redirect("/teacher/profile/" + req.params.id);
    });
  });

studentRouter
  .route("/remove/:studentID/:teacherID")
  .get(adminAuth, (req, res) => {
    Student.destroy({ where: { id: req.params.studentID } });
    res.redirect("/teacher/profile/" + req.params.teacherID);
    // res.redirect("/admin/profile");
  });

studentRouter.route("/logout").get((req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = studentRouter;
