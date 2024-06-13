const chatService = require("../../service/chat/chat.service");

const chatHistory = async (req, res) => {
  try {
    const history = await chatService.chatHistory();
    return res
      .status(201)
      .json({ message: "History Data Received", info: history });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  chatHistory,
};
