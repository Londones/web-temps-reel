const Quiz = require("../models/Quiz");
require("dotenv").config();

const QuizController = {
    async create(req, res) {
        try {
            const { title, description } = req.body;
            const quiz = await Quiz.create({ title, description });
            res.status(201).json({ quiz });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = QuizController;
