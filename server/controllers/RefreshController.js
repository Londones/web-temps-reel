const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const RefreshController = {
  async handleRefreshToken(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err || user.username !== decoded.username) return res.sendStatus(403);
      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const email = user.email;
      const username = user.username;
      const id = user.id;
      const name = user.name;
      const firstName = user.firstName;
      const role = user.role;
      res
        .status(200)
        .json({ token, email, username, id, name, firstName, role });
    });
  },
};

module.exports = RefreshController;
