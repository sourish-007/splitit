import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://split-it-b5u2.onrender.com",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});