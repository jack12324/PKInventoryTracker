const mongoose = require("mongoose");

const cabinetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  drawers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Drawer",
    default: [],
  },
});

cabinetSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const editable = returnedObject;
    editable.id = returnedObject._id.toString();
    delete editable._id;
    delete editable.__v;
  },
});

const Cabinet = mongoose.model("Cabinet", cabinetSchema);

module.exports = Cabinet;
