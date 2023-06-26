const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
  const { password, username } = req.body;

  if (!password) {
    res.status(400).send({ error: "password is required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).send({ error: "password must be at least 8 characters" });
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = User({
    username,
    passwordHash,
    admin: false,
  });
  const addedUser = await newUser.save();
  res.status(200).json(addedUser);
});

module.exports = usersRouter;
