const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
  const { password, userName } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = User({
    userName,
    passwordHash,
    admin: false,
  });
  const addedUser = await newUser.save();
  res.status(200).json(addedUser);
});

module.exports = usersRouter;
