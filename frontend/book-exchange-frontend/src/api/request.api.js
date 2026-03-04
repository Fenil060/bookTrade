import { clientServer } from "./client";

export const sendRequest = async (bookId) => {
  const res = await clientServer.post(`/api/requests/${bookId}`);
  return res.data;
};

// Get all requests sent by logged-in user
export const getSentRequests = async () => {
  const res = await clientServer.get("/api/requests/sent");
  return res.data; // { count, requests }
};

// Cancel a specific request
export const cancelRequest = async (requestId) => {
  const res = await clientServer.put(
    `/api/requests/${requestId}/cancel`
  );
  return res.data; // { message: "Request cancelled" }
};