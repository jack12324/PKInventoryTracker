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

drawersRouter.put("/:id", middleware.requireAdmin, async (req, res) => {
  const drawer = await Drawer.findById(req.params.id);
  const { name, cabinet, position } = req.body;
  const promises = [];

  if (!drawer) {
    res.status(404).send({ error: "drawer does not exist" });
  }

  const updatedDrawer = Drawer.findByIdAndUpdate(
    drawer._id,
    { name, cabinet, position },
    { new: true, runValidators: true, context: "query" }
  );

  promises.push(updatedDrawer);

  if (cabinet !== undefined) {
    const [fromCabinet, toCabinet] = await Promise.all([
      Cabinet.findById(drawer.cabinet),
      Cabinet.findById(cabinet),
    ]);

    if (!toCabinet) {
      res
        .status(400)
        .send({ error: `provided cabinet: ${cabinet} doesn't exist` });
      return;
    }

    promises.push(
      fromCabinet.updateOne({
        drawers: fromCabinet.drawers.filter(
          (d) => d.toString() !== drawer._id.toString()
        ),
      })
    );
    promises.push(
      toCabinet.updateOne({ drawers: toCabinet.drawers.concat(drawer._id) })
    );
  }
  const result = await Promise.all(promises);
  res.status(200).json(result[0]);
});

drawersRouter.get("/", async (req, res) => {
  const drawers = await Drawer.find();
  res.status(200).json(drawers);
});

module.exports = drawersRouter;
