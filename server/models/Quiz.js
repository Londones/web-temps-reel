require("dotenv").config();
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");

class Quiz extends Model {}

Quiz.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Quiz",
  }
);

module.exports = Quiz;
