import { clientServer } from "./client";

export const registerUser = async (data) => {
  const res = await clientServer.post("/api/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await clientServer.post("/api/auth/login", data);
  return res.data;
};

export const googleAuth = async(token) => {
  const res = await clientServer.post("/api/auth/google", {token});
  return res.data;
};

export const getProfile = async() => {
  const res = await clientServer.get("/api/auth/profile");
  return res.data;
};