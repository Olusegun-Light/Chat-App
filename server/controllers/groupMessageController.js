const GroupMessages = require("../models/groupMessageModel");

exports.addGroupMessage = async (req, res) => {
  try {
    const { from, groupId, message } = req.body;

    // Check if the required fields are present
    if (!message || !message.text) {
      return res.status(400).json({ error: "Message text is required" });
    }

    if (!groupId) {
      return res.status(400).json({ error: "Group ID is required" });
    }

    const data = await GroupMessages.create({
      group: groupId,
      sender: from,
      message: { text: message.text }, // Ensure message.text is passed correctly
    });

    if (data) return res.json({ msg: "Group message added successfully." });
    else return res.json({ msg: "Failed to add group message" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.body;

    const messages = await GroupMessages.find({ group: groupId }).sort({
      createdAt: 1,
    });

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === req.body.from,
      message: msg.message.text,
    }));

    res.json(projectedMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
