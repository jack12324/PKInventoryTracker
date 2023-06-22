const drawersRouter = require("express").Router();
const Cabinet = require("../models/cabinet");
const Drawer = require("../models/drawer");
const Item = require("../models/item");
const middleware = require("../utils/middleware");

drawersRouter.post("/", middleware.requireAdmin, async (req, res) => {
  const { cabinet, name, position } = req.body;

  if (!cabinet) {
    res.status(400).send({ error: "cabinet is required" });
    return;
  }

  const drawerCabinet = await Cabinet.findById(cabinet);
  if (!drawerCabinet) {
    res.status(400).send({ error: "given cabinet does not exist" });
    return;
  }

  const drawer = new Drawer({ name, position, cabinet });
  const newDrawer = await drawer.save();
  await drawerCabinet.updateOne({
    drawers: drawerCabinet.drawers.concat(drawer._id),
  });

  res.status(201).json(newDrawer);
});

drawersRouter.delete("/:id", middleware.requireAdmin, async (req, res) => {
  const drawer = await Drawer.findById(req.params.id);

  if (!drawer) {
    res.status(404).send({ error: "drawer does not exist" });
    return;
  }

  const cabinet = await Cabinet.findById(drawer.cabinet);

  await Promise.all([
    drawer.deleteOne(),
    ...drawer.items.map((i) => Item.findByIdAndDelete(i)),
    cabinet.updateOne({
      drawers: cabinet.drawers.filter(
        (d) => d.toString() !== drawer._id.toString()
      ),
    }),
  ]);
  res.status(200).end();
});

module.exports = drawersRouter;
