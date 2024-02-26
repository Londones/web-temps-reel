require("dotenv").config();
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");

class UserScore extends Model {}

UserScore.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserScore",
  }
);

module.exports = UserScore;
