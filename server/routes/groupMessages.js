const {
  addGroupMessage,
  getGroupMessages,
} = require("../controllers/groupMessageController");

const router = require("express").Router();

router.post("/addgroupmessage", addGroupMessage);
router.post("/getgroupmessages", getGroupMessages);

module.exports = router;
