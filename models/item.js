const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  drawer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drawer",
    required: true,
  },
});

itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const editable = returnedObject;
    editable.id = returnedObject._id.toString();
    delete editable._id;
    delete editable.__v;
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
