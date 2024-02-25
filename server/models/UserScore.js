require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

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
