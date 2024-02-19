const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const AuthController = {
  async register(req, res) {
    try {
      const { firstName, name, email, username, password } = req.body;
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists)
        return res.status(400).json({ error: "Email already exists" });
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists)
        return res.status(400).json({ error: "Username already exists" });
      const user = await User.create({
        firstName,
        name,
        email,
        username,
        password: bcrypt.hashSync(password, 10),
      });
      const userWithoutPassword = { ...user.dataValues };
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      const user = await User.findOne({ where: { email } });
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = jwt.sign(
          { username: user.username },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: "1d",
          }
        );
        user.refreshToken = refreshToken;
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async logout(req, res) {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    // is refreshToken in db?
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }
    // delete refreshToken from db
    user.refreshToken = null;
    await user.save();
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  },
};

module.exports = AuthController;
