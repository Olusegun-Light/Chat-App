const router = require("express").Router();

const groupController = require("../controllers/groupController"); 

// Create Group
router.post("/create", groupController.createGroup);

// Get User's Groups
router.get("/user/:userId", groupController.getUserGroups);

module.exports = router;
