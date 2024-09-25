import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const postGalleryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post(`/api/images`, reqBody);
});

export const getGalleryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.get(`/api/images`, reqBody);
});

export const deleteGalleryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.delete(`/api/images`, { data: reqBody });
});
