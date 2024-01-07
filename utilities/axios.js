import axios from "axios";

const instance = axios.create({
  baseURL: "https://instagram-clone-server-jvn7.onrender.com/api/v1",
  withCredentials: true,
});

export default instance;
