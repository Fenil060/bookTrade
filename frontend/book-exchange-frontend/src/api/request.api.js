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

export const getReceivedRequests = async () => {
  const res = await clientServer.get("/api/requests/received");
  return res.data; // { count, requests }
};

export const approveRequest = async (requestId) => {
  const res = await clientServer.put(`/api/requests/${requestId}/approve`);
  return res.data; // { message: "Request approved" }
}

export const rejectRequest = async (requestId) => {
  const res = await clientServer.put(`/api/requests/${requestId}/reject`);
  return res.data; // { message: "Request rejected" }
}