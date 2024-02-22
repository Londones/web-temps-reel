require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);
const Quiz = require("./Quiz");

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
    }
},
{
    sequelize,
    modelName: "Question",
});

// Question.belongsTo(Quiz, {
//     foreignKey: "quiz_id",
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
// });

module.exports = Question;
