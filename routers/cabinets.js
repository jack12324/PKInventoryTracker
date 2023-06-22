const cabinetsRouter = require("express").Router();
const Cabinet = require("../models/cabinet");
const Drawer = require("../models/drawer");
const middleware = require("../utils/middleware");

cabinetsRouter.post("/", middleware.requireAdmin, async (req, res) => {
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

cabinetsRouter.delete("/:id", middleware.requireAdmin, async (req, res) => {
  const cabinet = await Cabinet.findById(req.params.id);

  if (!cabinet) {
    res.status(404).send({ error: "cabinet does not exist" });
    return;
  }

  await Promise.all([
    cabinet.deleteOne(),
    ...cabinet.drawers.map((d) => Drawer.findByIdAndDelete(d)),
  ]);
  res.status(200).end();
});

cabinetsRouter.put("/:id", middleware.requireAdmin, async (req, res) => {
  const cabinet = await Cabinet.findById(req.params.id);

  if (!cabinet) {
    res.status(404).send({ error: "cabinet does not exist" });
    return;
  }

  const { name } = req.body || cabinet.name;

  const updatedCabinet = await Cabinet.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true, context: "query" }
  );

  res.status(200).json(updatedCabinet);
});

cabinetsRouter.get("/", async (req, res) => {
  const cabinets = await Cabinet.find();

  res.status(200).json(cabinets);
});

module.exports = cabinetsRouter;
