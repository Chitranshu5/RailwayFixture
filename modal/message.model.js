import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// ADD THESE INDEXES FOR FAST QUERIES
// Index for sender -> receiver queries with sorting
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// Index for receiver -> sender queries with sorting
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

const Message = mongoose.model("MessageFixture", messageSchema);

export default Message;