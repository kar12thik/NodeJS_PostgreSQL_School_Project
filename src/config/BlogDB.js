const Sequelize = require("sequelize");
const BlogDB = new Sequelize(process.env.DB_URL);
BlogDB.authenticate()
  .then(() => {
    console.log(
      "Connection has been established successfully with the school database."
    );
  })
  .catch(err => {
    console.error("Unable to connect to the School database:", err);
  });

module.exports = BlogDB;
