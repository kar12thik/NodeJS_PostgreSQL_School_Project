const Sequelize = require("sequelize");
const BlogDB = require("../config/BlogDB");
const faker = require("faker");
const { Teacher } = require("./Teachers");
const { generateHashSync } = require("../utils/hash");

function getRandomNumberBetween40and100() {
  return faker.random.number({ min: 40, max: 100 });
}
const fakeStudentsList = [];
let i = 0;
for (i = 0; i < 55; i++) {
  fakeStudentsList.push({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: "abcdef" + i,
    maths: getRandomNumberBetween40and100(),
    science: getRandomNumberBetween40and100(),
    social: getRandomNumberBetween40and100(),
    firstLanguage: getRandomNumberBetween40and100(),
    secondLanguage: getRandomNumberBetween40and100()
  });
}

const Student = BlogDB.define(
  "student",
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
    maths: Sequelize.INTEGER,
    science: Sequelize.INTEGER,
    social: Sequelize.INTEGER,
    firstLanguage: Sequelize.INTEGER,
    secondLanguage: Sequelize.INTEGER,
    teacherId: {
      type: Sequelize.INTEGER,
      references: {
        model: Teacher,
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

const StudentSync = ({ force = false, teacher = {} } = { force: false }) => {
  Student.sync({ force })
    .then(() => {
      fakeStudentsList.forEach(student => {
        let studentData = {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          password: student.password,
          teacherId: faker.random.number({ min: 1, max: 5 }),
          maths: student.maths,
          science: student.science,
          social: student.social,
          firstLanguage: student.firstLanguage,
          secondLanguage: student.secondLanguage
        };
        Student.create(studentData)
          .then(result => {
            console.log(result.get());
          })
          .catch(console.error);
      });
    })
    .catch(console.error);
};

exports.StudentSync = StudentSync;
exports.Student = Student;

// email: Delpha28@gmail.com
// password: abcdef1
