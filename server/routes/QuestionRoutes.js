const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const { create } = require("../controllers/QuestionController");

router.post("/create", create);

module.exports = router;
