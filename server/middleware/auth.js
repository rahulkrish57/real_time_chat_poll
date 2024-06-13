const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const loginUser = async (req, res, next) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });
    next();
  } catch (error) {}
};

module.exports = { loginUser };
