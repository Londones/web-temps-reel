require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);
const Question = require("./Question");

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

// Quiz.hasMany(Question, {
//     foreignKey: "quiz_id",
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
// });

module.exports = Quiz;
