const Group = require("../models/groupModel");

exports.createGroup = async (req, res) => {
  const { groupName, members } = req.body;
  try {
    const group = await Group.create({ groupName, members });
    return res.json({ status: true, group });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, error: "Server Error" });
  }
};

// Get User's Groups
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: { $in: [req.params.userId] } });
    return res.json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
