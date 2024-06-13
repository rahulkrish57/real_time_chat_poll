const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  room: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: String, required: true },
  poll_id: { type: String, required: true, unique: true },
  poll_title: { type: String, required: true },
  poll_desc: { type: String},
  poll_options: { type: Array, required: true },
  poll_details: { type: Array, required: true },
  token: { type: String, required: true },
  cAt: { type: Date },
  uAt: { type: Date },
});

module.exports = mongoose.model("poll", pollSchema);
