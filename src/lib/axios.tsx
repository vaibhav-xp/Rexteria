import axios from "axios";

const headers = {
  "Content-Type": "multipart/form-data",
};

const publicAxios = axios.create({ headers });

export default publicAxios;
