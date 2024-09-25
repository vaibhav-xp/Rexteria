import axios from "axios";

const headers = {
  "Content-Type": "multipart/form-data",
};

const publicAxios = axios.create({ headers, withCredentials: true });
export const jsonAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default publicAxios;
