const express = require("express");
const router = express.Router({ mergeParams: true });
const pollController = require("../../controller/poll/poll.controller");

router.get("/history", pollController.pollHistory);
// router.patch("/vote", pollController.pollVote);

module.exports = router;
