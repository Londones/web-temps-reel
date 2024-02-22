require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

class Question extends Model {}

Question.init({
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    answers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
},
{
    sequelize,
    modelName: "Question",
});

module.exports = Question;
