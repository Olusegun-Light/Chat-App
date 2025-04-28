const mongoose = require("mongoose");

const GroupMessageSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      text: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupMessages", GroupMessageSchema);
