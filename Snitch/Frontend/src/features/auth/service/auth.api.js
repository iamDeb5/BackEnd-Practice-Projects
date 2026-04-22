import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export const register = async ({
  email,
  contact,
  password,
  fullName,
  isSeller,
}) => {
  try {
    const response = await authApiInstance.post("/register", {
      email,
      contact,
      password,
      fullName,
      isSeller,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await authApiInstance.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
