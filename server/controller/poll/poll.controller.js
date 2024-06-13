const pollService = require("../../service/poll/poll.service");

const pollHistory = async (req, res) => {
  try {
    const history = await pollService.pollHistory();
    return res
      .status(201)
      .json({ message: "History Data Received", info: history });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  pollHistory,
};
