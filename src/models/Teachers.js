const Sequelize = require("sequelize");
const BlogDB = require("../config/BlogDB");
const faker = require("faker");
const { Admin } = require("./Admins");
const { generateHashSync } = require("../utils/hash");

const fakeTeachersList = [];
let i = 0;
for (i = 0; i < 6; i++) {
  fakeTeachersList.push({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: "abcdef" + i
  });
}

const Teacher = BlogDB.define(
  "teacher",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: Sequelize.STRING,
    adminId: {
      type: Sequelize.INTEGER,
      references: {
        model: Admin,
        key: "id"
      }
    }
  },

  {
    setterMethods: {
      password(plainTextPassword) {
        this.setDataValue("password", generateHashSync(plainTextPassword));
      }
    },
    getterMethods: {
      fullName() {
        return (
          this.getDataValue("firstName") + " " + this.getDataValue("lastName")
        );
      }
    }
  }
);

const TeacherSync = ({ force = false, admin = {} } = { force: false }) => {
  return new Promise((resolve, reject) => {
    Teacher.sync({ force })
      .then(() => {
        fakeTeachersList.forEach(teacher => {
          let TeacherData = {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            password: teacher.password,
            adminId: admin.id
          };
          Teacher.create(TeacherData)
            .then(result => {
              console.log(result.get());
              resolve(result.get());
            })
            .catch(err => {
              reject(err);
            });
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.TeacherSync = TeacherSync;
exports.Teacher = Teacher;

// username: Hilma27@gmail.com
// password: abcdef3
