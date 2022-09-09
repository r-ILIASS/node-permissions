// TODO: -- add createdAt and updatedAT to the Schema
//       -- don't send password in responses unless it's requested

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2413,
    },
    Editor: Number,
    Admin: Number,
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
