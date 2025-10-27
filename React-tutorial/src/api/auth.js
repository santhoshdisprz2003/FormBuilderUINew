import axiosInstance from "./axiosInstance";

export const login = async (credentials) => {
  console.log(credentials)
  const response = await axiosInstance.post("/login", credentials);
  return response.data;
};

export const register = async (user) => {
  const response = await axiosInstance.post("/register", user);
  return response.data;
};
