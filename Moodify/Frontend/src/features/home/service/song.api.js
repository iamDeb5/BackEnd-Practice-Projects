import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "",
  withCredentials: true,
});

export const getSong = async ({ mood }) => {
  try {
    const response = await api.get(`/api/songs?mood=${mood}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
