const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const User = require("../models/user");
const Cabinet = require("../models/cabinet");
const Drawer = require("../models/drawer");

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

const generateRandomCabinetData = (count, minDrawers = 0) =>
  Array.from(new Array(count), () => ({
    name: uuid(),
    numDrawers: Math.floor(Math.random() * 6) + minDrawers,
  }));

const getRandomCabinetFrom = async (cabinets) => {
  const cabinet = cabinets[Math.floor(Math.random() * cabinets.length)];
  return Cabinet.findOne({ name: cabinet.name });
};

const getNonExistingCabinetId = async () => {
  const cabinet = await new Cabinet({ name: uuid() }).save();
  await cabinet.deleteOne();
  return cabinet._id.toString();
};
const generateDrawersForCabinet = (cabinet, numDrawers) =>
  numDrawers > 0
    ? Array.from(
        new Array(numDrawers),
        (_, i) => new Drawer({ cabinet: cabinet._id, position: i + 1 })
      )
    : [];

const generateDrawersFromCabinets = (cabinets) =>
  cabinets.flatMap((c) => generateDrawersForCabinet(c));

const populateCabinet = async (cabinetData) => {
  const cabinet = new Cabinet({ name: cabinetData.name });
  const drawers = generateDrawersForCabinet(cabinet, cabinetData.numDrawers);
  cabinet.drawers = drawers.map((d) => d._id);
  return Promise.all([cabinet.save(), ...drawers.map((d) => d.save())]);
};

module.exports = {
  getTokenForUser,
  getInvalidToken,
  generateRandomUserData,
  getRandomUserOf,
  getRandomAdminTokenFrom,
  getRandomNonAdminTokenFrom,
  generateRandomCabinetData,
  getRandomCabinetFrom,
  getNonExistingCabinetId,
  generateDrawersFromCabinets,
  populateCabinet,
};
