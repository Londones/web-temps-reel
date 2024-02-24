const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
require("dotenv").config();

const compareArrays = (a, b) =>
  a.length === b.length && a.every((element, index) => element === b[index]);

const QuizController = {
    async create(req, res) {
        try {
            const { title, description } = req.body;
            const quiz = await Quiz.create({ title, description });
            res.status(201).json({ quiz });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAllQuiz() {
        try {
            const quizzes = await Quiz.findAll();
            return quizzes;
        } catch (error) {
            console.error(error);
        }
        return []
    },

    async getQuestionForQuiz(quizId, usedQuestions = []) {
        try {
            const question = (await Question.findAll({ where: { quiz_id: quizId },
                attributes: ['id', 'quiz_id', 'question', 'options'],
            })).find(question => !usedQuestions.includes(question.id))
            return question;
        } catch (error) {
            console.error(error);
        }
        return null
    },

    async checkAnswerForQuestion(quizId, questionId, answers) {
        try {
            const question = (await Question.findOne({ quiz_id: quizId, question_id: questionId }));
            if (!question) return false;  
            else if (question.answers.length === answers.length) {
                answers.sort();
                question.answers.sort();
                return answers.every((answer, index) => answer === question.answers[index]);
            } else return false;
        } catch (error) {
            console.error(error);
        }
        return false
    },

    async getQuestions(req, res) {
        try {
            const { quiz_id } = req.params;
            const questions = await Question.findAll({ quiz_id: quiz_id });
            res.status(200).json({ questions });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = QuizController;
