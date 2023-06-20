const cabinetsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Cabinet = require("../models/cabinet");
const Drawer = require("../models/drawer");

const extractToken = (req) => {
  const auth = req.get("Authorization");
  if (auth && auth.includes("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
  return null;
};
cabinetsRouter.post("/", async (req, res) => {
  const token = extractToken(req);

  if (!token) {
    res.status(400).send({ error: "authorization token missing from request" });
    return;
  }

  const tokenUser = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(tokenUser.id);

  if (!user) {
    res.status(401).send({ error: "user for provided token doesn't exist" });
    return;
  }

  if (!user.admin) {
    res.status(401).send({ error: `user: ${user.userName} is not an admin` });
    return;
  }

  const { name, numDrawers } = req.body;

  const newCabinet = new Cabinet({
    name,
  });

  const drawers =
    numDrawers > 0
      ? Array.from(
          new Array(numDrawers),
          (_, i) => new Drawer({ cabinet: newCabinet._id, position: i + 1 })
        )
      : [];

  newCabinet.drawers = drawers.map((d) => d._id);

  await Promise.all(drawers.map((d) => d.save()));
  const addedCabinet = await newCabinet.save();

  res.status(201).json(addedCabinet);
});

module.exports = cabinetsRouter;
