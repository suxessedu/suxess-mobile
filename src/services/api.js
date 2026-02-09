import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Live Backend URL
const PROD_URL = "https://suxessedu.pythonanywhere.com/api";
const DEV_URL = "http://192.168.137.82:5000/api";

const API_URL = PROD_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add a request interceptor to inject the session cookie
api.interceptors.request.use(
  async (config) => {
    const cookie = await AsyncStorage.getItem("userCookie");
    if (cookie) {
      config.headers.Cookie = cookie;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
