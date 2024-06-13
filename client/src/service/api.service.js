import axios from "axios";
const BASE_URL = "https://chat-api-5l1t.onrender.com/api";
export const apiService = {
  register,
  login,
  chatHistory,
  pollHistory
};

function register(body) {
  return axios.post(`${BASE_URL}/auth/register`, body);
}

function login(body) {
  return axios.post(`${BASE_URL}/auth/login`, body);
}

function chatHistory(config) {
  return axios.get(`${BASE_URL}/chat/history`, config);
}

function pollHistory(config) {
  return axios.get(`${BASE_URL}/poll/history`, config);
}
