import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8000/",
    //baseURL: 'http://127.0.0.1:8080/',
  // baseURL: "https://randomuser.me/api/",
  responseType: "json"
});