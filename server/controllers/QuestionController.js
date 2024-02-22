const Question = require("../models/Question");
require("dotenv").config();

const QuestionController = {
    async create(req, res) {
        try {
            const { question, options, answers, quiz_id } = req.body;
            const newQuestion = await Question.create({ question, options, answers, quiz_id });
            res.status(201).json({ newQuestion });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = QuestionController;
