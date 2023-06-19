const mongoose = require("mongoose");

const drawerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cabinet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabinet",
    required: true,
  },
  items: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Item",
    default: [],
  },
});

drawerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const editable = returnedObject;
    editable.id = returnedObject._id.toString();
    delete editable._id;
    delete editable.__v;
  },
});

const Drawer = mongoose.model("Drawer", drawerSchema);

module.exports = Drawer;
