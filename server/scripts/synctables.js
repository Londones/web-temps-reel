const User = require("../models/User");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

async function syncTables() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await User.sync({ force: true });
    console.log("User table created.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

syncTables();
