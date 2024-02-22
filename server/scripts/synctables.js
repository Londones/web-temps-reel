const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

async function syncTables() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await User.sync({ force: true });
    Quiz.hasMany(Question, {
      foreignKey: "quiz_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Question.belongsTo(Quiz, {
      foreignKey: "quiz_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await Quiz.sync({ force: true });
    await Question.sync({ force: true });
    console.log("User table created.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

syncTables();
