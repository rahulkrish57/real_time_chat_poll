const express = require("express");
const router = express.Router({ mergeParams: true });
const chatController = require("../../controller/chat/chat.controller");

router.get("/history", chatController.chatHistory);

module.exports = router;
