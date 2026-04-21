import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const config = {
  PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
