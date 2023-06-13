const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minLength: 5,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const editable = returnedObject;
    editable.id = returnedObject._id.toString();
    delete editable._id;
    delete editable.__v;
    delete editable.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = User;
