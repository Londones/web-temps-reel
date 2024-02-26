const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const UserScore = require("../models/UserScore");
require("dotenv").config();

const sequelize = require("../config/sequelizeConfig");

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
    UserScore.belongsTo(User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(UserScore, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    UserScore.belongsTo(Quiz, {
      foreignKey: "quizId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Quiz.hasMany(UserScore, {
      foreignKey: "quizId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await UserScore.sync({ force: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

syncTables();
