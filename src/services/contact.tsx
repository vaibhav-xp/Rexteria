import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const postContactFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post(`/api/contact`, reqBody);
});

export const patchContactFn = apiAsyncHandle((reqBody) => {
  return publicAxios.patch(`/api/contact`, reqBody);
});

export const getContactFn = apiAsyncHandle((reqBody) => {
  return publicAxios.get(`/api/contact`, { params: reqBody });
});

export const deleteContactFn = apiAsyncHandle((reqBody) => {
  return publicAxios.delete(`/api/contact`, { data: reqBody });
});
