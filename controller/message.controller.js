import { getReceiverSocketId, io } from "../index.js";
import Message from "../modal/message.model.js";
import User from "../modal/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Query for messages between two users
    const query = {
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    };

    const totalMessages = await Message.countDocuments(query);
    // console.log("Total messages in DB:", totalMessages);

    // Fetch messages with pagination
    // Sort by createdAt descending (newest first) for pagination
    // Then reverse to show chronologically (oldest to newest)
    const messages = await Message.find(query)
      .sort({ createdAt: -1 }) // Newest first for correct pagination
      .skip(skip) // Skip already loaded pages
      .limit(limit) // Limit to 20 messages per page
      .lean(); // Better performance

    // Reverse to display oldest to newest in UI
    const messagesInOrder = messages.reverse();

    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
      hasMore: skip + messages.length < totalMessages,
    };

    // Return new format with pagination
    res.status(200).json({
      messages: messagesInOrder,
      pagination,
    });
  } catch (error) {
    console.error("Error in get messages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      imageUrl = result.secure_url;
    }
    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", message);
    }
    res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
