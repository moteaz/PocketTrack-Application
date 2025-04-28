import axios from "axios";
import { BASE_URL } from "./apiPathes"; 

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request Interceptor: Add Authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized (e.g., token expired)
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Redirect to login page
            }
            else if(error.response.status === 500)
            {
                console.error("Server Error Try Again Letter")
            }
        } else {
            // Handle network errors
            console.error("Network Error:", error);
            return Promise.reject({ message: "Network Error" });
        }
    }
);

export default axiosInstance;
