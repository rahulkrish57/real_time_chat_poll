const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  room: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: String, required: true },
  chat_id: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  token: { type: String, required: true },
  cAt: { type: Date },
  uAt: { type: Date },

  // Add other fields as necessary
});

module.exports = mongoose.model("Chat", chatSchema);
