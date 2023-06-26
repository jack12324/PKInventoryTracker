const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    res.status(400).send({ error: "username is required" });
    return;
  }
  if (!password) {
    res.status(400).send({ error: "password is required" });
    return;
  }

  const user = await User.findOne({ username });

  if (!user) {
    res.status(404).send({ error: "user doesn't exist" });
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    res.status(422).send({ error: "invalid password" });
    return;
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET,
    { expiresIn: "12h" }
  );

  res.status(200).send({ token, username: user.username });
});

module.exports = loginRouter;
