const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const { register, login, logout } = require("../controllers/AuthController");

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
