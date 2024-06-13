const User = require("../../models/user");
const Chat = require("../../models/chat");
// helper
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const chatHistory = async () => {
  try {
    const chatHis = await Chat.find();
    if (chatHis) {
      return chatHis;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  chatHistory,
};
