// require("dotenv/config");
const { Sequelize } = require("sequelize");
const DBNAME = process.env.DBNAME;
const USERNAME = process.env.DBUSERNAME;
const PASSWORD = process.env.DBPASSWORD;
console.log({ PASSWORD });

const sequelize = new Sequelize(DBNAME, USERNAME, PASSWORD, {
  host: "localhost",
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = sequelize;
