import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5214/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const excludedEndpoints = ['/login', '/register'];
  const isExcluded = excludedEndpoints.some(endpoint => config.url?.includes(endpoint));
  if (!isExcluded) {
    const token = localStorage.getItem("token");
    if (token)
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response
);



export default axiosInstance;
