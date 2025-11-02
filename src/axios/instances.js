import axios from "axios";

// const baseURL = 'https://staging.api.cw.smartimmigrant.com/api/v1'
const baseURL = "http://localhost:5000/api/v1";

const publicRequest = axios.create({ baseURL, withCredentials: true });

const privateRequest = axios.create({
  baseURL,
  withCredentials: true,
  credentials: "include",
});

// attach token
// privateRequest.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// Handle 401
privateRequest.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem("token");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

const instances = { publicRequest, privateRequest };
export default instances;
