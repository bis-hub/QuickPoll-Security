const express = require("express");
const router = express.Router();
const pollController = require("../controllers/poll-controller");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth");
const User = require("../models/user");

router
  .route("/polls")
  .get(authenticateUser, pollController.getAllPolls)
  .post(authenticateUser, pollController.createPoll)
  .put((req, res) => {
    res.status(405).json({ error: "PUT request is not allowed" });
  });

router.route("/checkauth").get(authenticateUser, (req, res) => {
  res.json({ message: "user is authenticated" });
});

router.route("/getallusers").get(authenticateUser, authorizeAdmin, async (req, res) => {
  const Allusers = await User.find({}, { username: 1, role: 1, email: 1 });
  return res.json(Allusers);
});

router
  .route("/polls/:poll_id")
  .get(pollController.getPollById)
  .post((req, res) => {
    res.status(405).json({ error: "POST request is not allowed" });
  })
  .put(authenticateUser, pollController.updatePollById)
  .delete(pollController.deletePollById);

router.get("/mypolls", authenticateUser, pollController.getUserPolls);

module.exports = router;
