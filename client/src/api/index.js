import axios from "axios";

export const BASE_URL = "http://localhost:5000/api";

export const fetchGet = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    return error.response.data;
  }
};

export const fetchPost = async (url, body) => {
  try {
    const { data } = await axios.post(url, body);
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    return error.response.data;
  }
};

export const fetchPut = async (url, body) => {
  try {
    const { data } = await axios.put(url, body);
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    return error.response.data;
  }
};

export const fetchDelete = async (url) => {
  try {
    const { data } = await axios.delete(url);
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    return error.response.data;
  }
};
