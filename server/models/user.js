const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  cAt: { type: Date, default: new Date() },
  loginAt: { type: String, default: new Date() },
  // Add other fields as necessary
});

module.exports = mongoose.model("User", userSchema);
