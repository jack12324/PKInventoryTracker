const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const User = require("../models/user");

const getTokenForUser = (user) => {
  const userForToken = {
    userName: user.userName,
    id: user._id,
  };
  return jwt.sign(userForToken, process.env.SECRET);
};

const generateRandomUserData = (count) =>
  Array.from(new Array(count), () => ({
    userName: uuid(),
    passwordHash: uuid(),
    admin: Math.random() > 0.5,
  }));

const getRandomUserOf = async (users, filter = () => true) => {
  const filtered = users.filter(filter);
  const userData = filtered[Math.floor(Math.random() * filtered.length)];
  return User.findOne({ userName: userData.userName });
};

const getRandomAdminTokenFrom = async (users) => {
  const user = await getRandomUserOf(users, (u) => u.admin);
  return getTokenForUser(user);
};

const getRandomNonAdminTokenFrom = async (users) => {
  const user = await getRandomUserOf(users, (u) => !u.admin);
  return getTokenForUser(user);
};

const getInvalidToken = async () => {
  const user = new User({
    userName: uuid(),
    admin: true,
    passwordHash: "LJSDF",
  });
  await user.save();
  const token = getTokenForUser(user);
  await user.deleteOne();
  return token;
};

module.exports = {
  getTokenForUser,
  getInvalidToken,
  generateRandomUserData,
  getRandomUserOf,
  getRandomAdminTokenFrom,
  getRandomNonAdminTokenFrom,
};
