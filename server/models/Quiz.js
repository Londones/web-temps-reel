require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

class Quiz extends Model {}

Quiz.init({
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
},
{
    sequelize,
    modelName: "Quiz",
});

module.exports = Quiz;
