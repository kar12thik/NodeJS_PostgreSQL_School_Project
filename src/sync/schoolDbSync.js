const { AdminSync } = require("../models/Admins");
const { StudentSync } = require("../models/Students");
const { TeacherSync } = require("../models/Teachers");

AdminSync({ force: true })
  .then(admin => {
    TeacherSync({ force: true, admin }).then(teacher => {
      StudentSync({ force: true, teacher })
    }).catch(console.error);;
  })
  .catch(console.error);
