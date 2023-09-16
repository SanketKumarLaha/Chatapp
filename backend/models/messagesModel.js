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
  const messages = await this.find({
    $or: [{ clickedUserId: id }, { userId: id }],
  });
  return messages;
};

module.exports = mongoose.model("message", MessagesSchema);
