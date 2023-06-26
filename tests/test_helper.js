const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Cabinet = require("../models/cabinet");
const Drawer = require("../models/drawer");
const Item = require("../models/item");

const getTokenForUser = (user) => {
  const userForToken = {
    userName: user.userName,
    id: user._id,
  };
  return jwt.sign(userForToken, process.env.SECRET);
};

const generateUser = async (userData) => {
  const numSalts = 10;
  const passwordHash = await bcrypt.hash(userData.password, numSalts);
  return new User({
    userName: userData.userName,
    passwordHash,
    admin: userData.admin,
  }).save();
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

const getNonExistingDrawerId = async () => {
  const cabinet = await new Cabinet({ name: uuid() }).save();
  const drawer = await new Drawer({
    name: uuid(),
    position: 0,
    cabinet: cabinet._id,
  }).save();
  await Promise.all([drawer.deleteOne(), cabinet.deleteOne()]);
  return drawer._id.toString();
};

const getNonExistingItemId = async () => {
  const cabinet = await new Cabinet({ name: uuid() }).save();
  const drawer = await new Drawer({
    name: uuid(),
    position: 0,
    cabinet: cabinet._id,
  }).save();
  const item = await new Item({ name: uuid(), drawer: drawer._id }).save();
  await Promise.all([
    drawer.deleteOne(),
    cabinet.deleteOne(),
    item.deleteOne(),
  ]);
  return item._id.toString();
};
const generateDrawersForCabinet = (cabinet, numDrawers) =>
  numDrawers > 0
    ? Array.from(
        new Array(numDrawers),
        (_, i) => new Drawer({ cabinet: cabinet._id, position: i + 1 })
      )
    : [];

const generateItemsForDrawer = (drawer, numItems) =>
  numItems > 0
    ? Array.from(
        new Array(numItems),
        () => new Item({ name: uuid(), drawer: drawer._id })
      )
    : [];
const populateDrawer = async (drawer) => {
  const items = generateItemsForDrawer(
    drawer,
    Math.floor(Math.random() * 5) + 1
  );
  // eslint-disable-next-line no-param-reassign
  drawer.items = items.map((i) => i._id);
  return Promise.all([drawer.save(), ...items.map((i) => i.save())]);
};
const populateCabinet = async (cabinetData) => {
  const cabinet = new Cabinet({ name: cabinetData.name });
  const drawers = generateDrawersForCabinet(cabinet, cabinetData.numDrawers);
  cabinet.drawers = drawers.map((d) => d._id);
  const fullDrawers = drawers.map((d) => populateDrawer(d));
  return Promise.all([cabinet.save(), ...fullDrawers]);
};

const getRandomDrawerFromCabinets = async (cabinets) => {
  const cabinetData = cabinets[Math.floor(Math.random() * cabinets.length)];
  const cabinet = await Cabinet.findOne({ name: cabinetData.name });
  return Drawer.findById(
    cabinet.drawers[Math.floor(Math.random() * cabinet.drawers.length)]
  );
};

const setupAndGetDrawerForTest = async (numCabinets = 2) => {
  const cabinets = generateRandomCabinetData(numCabinets, 1);
  await Promise.all(cabinets.map((c) => populateCabinet(c)));
  return getRandomDrawerFromCabinets(cabinets);
};

const setupAndGetItemForTest = async (numCabinets = 2) => {
  const drawer = await setupAndGetDrawerForTest(numCabinets);
  return Item.findById(
    drawer.items[Math.floor(Math.random() * drawer.items.length)]
  );
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
  getNonExistingDrawerId,
  getNonExistingItemId,
  populateCabinet,
  getRandomDrawerFromCabinets,
  setupAndGetDrawerForTest,
  setupAndGetItemForTest,
  generateUser,
};
