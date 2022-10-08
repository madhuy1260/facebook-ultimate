const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  user: { type: ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Code", codeSchema);
