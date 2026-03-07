import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "",
  withCredentials: true,
});

export const register = async ({ email, username, password }) => {
  const response = await api.post("/api/auth/register", {
    email,
    username,
    password,
  });
  return response.data;
};

export const login = async ({ email, username, password }) => {
  const response = await api.post("/api/auth/login", {
    email,
    username,
    password,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/api/auth/get-me");
  return response.data;
};

export const logout = async () => {
  const response = await api.get("/api/auth/logout");
  return response.data;
};
