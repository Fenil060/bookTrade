import Request from "../models/Request.js";
import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  const { requestId, message } = req.body;

  const request = await Request.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.status !== "approved") {
    return res.status(403).json({ message: "Chat not allowed" });
  }

  const userId = req.user.id;

  if (
    request.buyerId.toString() !== userId &&
    request.sellerId.toString() !== userId
  ) {
    return res.status(403).json({ message: "Not authorized for chat" });
  }

  const newMessage = await Message.create({
    requestId,
    senderId: userId,
    message
  });

  res.status(201).json(newMessage);
};

export const getMessages = async (req, res) => {
  const { requestId } = req.params;

  const request = await Request.findById(requestId);

  if (!request || request.status !== "approved") {
    return res.status(403).json({ message: "Chat not allowed" });
  }

  const userId = req.user.id;

  if (
    request.buyerId.toString() !== userId &&
    request.sellerId.toString() !== userId
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const messages = await Message.find({ requestId }).sort({ createdAt: 1 });

  res.json(messages);
};

