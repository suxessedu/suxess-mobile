import axios from "axios";

// Live Backend URL
const PROD_URL = "https://suxessedu.pythonanywhere.com/api";
const DEV_URL = "http://192.168.137.164:5000/api";

const API_URL = __DEV__ ? DEV_URL : PROD_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
