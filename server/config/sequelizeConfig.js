const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("webtempsreel", "postgres", "password", {
  host: "db",
  dialect: "postgres",
  logging: console.log,
});

module.exports = sequelize;
