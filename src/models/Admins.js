const Sequelize = require("sequelize");
const BlogDB = require("../config/BlogDB");
const { generateHashSync } = require("../utils/hash");

const Admin = BlogDB.define(
  "admin",
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
    password: Sequelize.STRING
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

const AdminSync = ({ force = false } = { force: false }) => {
  return new Promise((resolve, reject) => {
    Admin.sync({ force })
      .then(() => {
        const schoolAdmin = {
          firstName: "sachindra",
          lastName: "ragul",
          email: "admin@test.com",
          password: "123456"
        };
        Admin.create(schoolAdmin)
          .then(result => {
            console.log(result.get());
            resolve(result.get());
          })
          .catch(reject);
      })
      .catch(reject);
  });
};
exports.Admin = Admin;
exports.AdminSync = AdminSync;

// email: "admin@test.com",
// password: "123456"
