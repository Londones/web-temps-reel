const UserScore = require("../models/UserScore");

const UserScoreController = {
  async create(req, res) {
    try {
      const { userId, quizId, score, rank } = req.body;
      const newUserScore = await UserScore.create({
        userId,
        quizId,
        score,
        rank,
      });
      res.status(201).json({ newUserScore });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getScores(req, res) {
    try {
      const scores = await UserScore.findAll();
      res.status(200).json({ scores });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getScore(req, res) {
    try {
      const { id } = req.params;
      const score = await UserScore.findByPk(id);
      res.status(200).json({ score });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getScoresByUser(req, res) {
    try {
      const { userId } = req.params;
      const scores = await UserScore.findAll({ where: { userId } });
      res.status(200).json({ scores });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getRankingByQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const scores = await UserScore.findAll({
        where: { quizId },
        order: [["rank", "ASC"]],
      });
      res.status(200).json({ scores });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = UserScoreController;
