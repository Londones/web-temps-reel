const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const { create, getQuestions } = require("../controllers/QuizController");

router.post("/create", create);
router.get("/:quiz_id/questions", getQuestions);

module.exports = router;
