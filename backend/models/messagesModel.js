const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    clickedUserId: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

MessagesSchema.statics.getUserMessages = async function (id) {
  console.log("MessagesSchema id", id);
  const messages = await this.find({
    $or: [{ clickedUserId: id }, { userId: id }],
  });
  console.log("messages", messages);
  return messages;
};

module.exports = mongoose.model("message", MessagesSchema);
