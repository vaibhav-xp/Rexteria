import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const postGalleryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post(`/api/images`, reqBody);
});

export const getGalleryFn = apiAsyncHandle(() => {
  return publicAxios.get(`/api/images`);
});

export const deleteGalleryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.delete(`/api/images`, { data: reqBody });
});
