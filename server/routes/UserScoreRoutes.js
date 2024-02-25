const express = require("express");
const router = express.Router();
const UserScoreController = require("../controllers/UserScoreController");

router.post("/", UserScoreController.create);
router.get("/", UserScoreController.getScores);
router.get("/:id", UserScoreController.getScore);
router.get("/user/:userId", UserScoreController.getScoresByUser);
router.get("/quiz/:quizId", UserScoreController.getRankingByQuiz);

module.exports = router;
