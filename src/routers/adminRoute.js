const express = require("express");
const { Teacher } = require("../models/Teachers");
const { Student } = require("../models/Students");
const { Admin } = require("../models/Admins");
const { compareHash } = require("../utils/hash");
const adminAuth = require("../middlewares/adminAuth");
const {
  adminTokenGenerator,
  adminTokenValidator
} = require("../utils/adminTokenManager");
const adminRouter = express.Router();
adminRouter
  .route("/login")
  .get((req, res) => {
    res.render("login", {
      layout: "login",
      path: "admin"
    });
  })
  .post((req, res) => {
    const { email = "", password = "" } = req.body;
    Admin.findOne({
      where: {
        email
      }
    })
      .then(adminInstance => {
        if (adminInstance) {
          const admin = adminInstance.get();
          const {
            id = "",
            email: emailFromDB = "",
            firstName = "",
            lastName = "",
            password: passwordFromDb = ""
          } = admin;
          compareHash(password, passwordFromDb)
            .then(isSuccess => {
              if (isSuccess) {
                const jwtToken = adminTokenGenerator({
                  id,
                  email: emailFromDB,
                  firstName,
                  lastName
                });
                res.cookie("jwt", jwtToken, { httpOnly: true });
                res.redirect("/admin/profile");
              } else {
                res.status(500).send("No admin user found");
              }
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Internal Server Error");
            });
        } else {
          res.status(400).send("No admin user");
        }
      })
      .catch(err => console.error);
  });

adminRouter.route("/profile").get(adminAuth, (req, res) => {
  Teacher.findAll().then(teacherInstance => {
    const teacherGrp = teacherInstance.map(instance => instance.get());
    res.render("adminProfile", {
      layout: "login",
      teacherGrp
    });
  });
});

adminRouter
  .route("/addteacher")
  .get(adminAuth, (req, res) => {
    res.render("addTeacher", {
      layout: "addTeacherForm",
      adminId: req.user.id
    });
  })
  .post(adminAuth, (req, res) => {
    let TeacherData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      adminId: req.body.adminId
    };
    Teacher.create(TeacherData)
      .then(result => {
        console.log(result.get());
      })
      .catch(console.error);
    res.redirect("/admin/profile");
  });

adminRouter
  .route("/addStudent/(:id)?")
  .get(adminAuth, (req, res) => {
    res.render("addStudent", {
      layout: "login"
    });
  })
  .post(adminAuth, (req, res) => {
    let studentData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      teacherId: req.body.teacherId
    };
    Student.create(studentData)
      .then(result => {
        console.log(result.get());
      })
      .catch(console.error);
    res.redirect("/admin/profile");
  });

adminRouter.route("/logout").get((req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = adminRouter;
