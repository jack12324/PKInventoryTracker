const itemRouter = require("express").Router();
const Drawer = require("../models/drawer");
const Item = require("../models/item");
const middleware = require("../utils/middleware");

itemRouter.post("/", middleware.requireAdmin, async (req, res) => {
  const { name, drawer } = req.body;

  if (!drawer || drawer === "") {
    res.status(400).send({ error: "drawer is required" });
    return;
  }

  const toDrawer = await Drawer.findById(drawer);

  if (!toDrawer) {
    res.status(404).send({ error: "given drawer does not exist" });
    return;
  }

  const newItem = new Item({ name, drawer: toDrawer._id });

  const drawerUpdate = toDrawer.updateOne({
    items: toDrawer.items.concat(newItem._id),
  });

  const result = await Promise.all([drawerUpdate, newItem.save()]);
  res.status(201).json(result[1]);
});

itemRouter.delete("/:id", middleware.requireAdmin, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res
      .status(404)
      .send({ error: `item with id ${req.params.id} does not exist` });
    return;
  }

  const drawer = await Drawer.findById(item.drawer);

  await Promise.all([
    item.deleteOne(),
    drawer.updateOne({
      items: drawer.items.filter((i) => i.toString() !== item._id.toString()),
    }),
  ]);

  res.status(200).end();
});

itemRouter.put("/:id", middleware.requireAdmin, async (req, res) => {
  const { name, drawer } = req.body;
  const item = await Item.findById(req.params.id);

  if (!item) {
    res
      .status(404)
      .send({ error: `item with id: ${req.params.id} doesn't exist` });
    return;
  }

  const promises = [];
  if (drawer !== undefined) {
    const fromDrawer = await Drawer.findById(item.drawer);
    const toDrawer = await Drawer.findById(drawer);

    if (!toDrawer) {
      res
        .status(404)
        .send({ error: `provided drawer: ${drawer} doesn't exist` });
      return;
    }

    const updateFromDrawer = fromDrawer.updateOne({
      items: fromDrawer.items.filter(
        (i) => i.toString() !== item._id.toString()
      ),
    });
    const updateToDrawer = toDrawer.updateOne({
      items: toDrawer.items.concat(item._id),
    });
    promises.push(updateToDrawer);
    promises.push(updateFromDrawer);
  }
  const updateItem = Item.findByIdAndUpdate(
    req.params.id,
    { name, drawer },
    { runValidators: true, new: true, context: "query" }
  );

  const result = await Promise.all([updateItem, ...promises]);
  res.status(200).json(result[0]);
});

itemRouter.get("/", async (req, res) => {
  const items = await Item.find();
  res.status(200).json(items);
});

module.exports = itemRouter;
