import axios from "axios";

const axiosJWT = axios.create({
  baseURL:
    "https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api",
});

// Add a request interceptor
axiosJWT.interceptors.request.use(
  (request) => {
    if (!request.headers["Authorization"]) {
      const storedAccessToken = localStorage.getItem("accessToken") || "";
      request.headers["Authorization"] = `Bearer ${storedAccessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

export default axiosJWT;
