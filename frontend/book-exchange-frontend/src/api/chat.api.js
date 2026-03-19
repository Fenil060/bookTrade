import { clientServer } from "./client";

// GET messages
export const getMessages = async (requestId) => {
  const res = await clientServer.get(`/api/chat/${requestId}/getMessages`);
  return res.data;
};

// SEND message
export const sendMessage = async (data) => {
  const res = await clientServer.post(`/api/chat/sendMessages`, data);
  return res.data;
};