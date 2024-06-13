const User = require("../../models/user");
const Poll = require("../../models/poll");
// helper
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const pollHistory = async () => {
  try {
    const pollHis = await Poll.find();
    if (pollHis) {
      return pollHis;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  pollHistory,
};
