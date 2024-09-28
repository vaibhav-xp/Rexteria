import publicAxios, { jsonAxios } from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const addToWishlistFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post(`/api/wishlist`, reqBody);
});

export const getWishlistFn = apiAsyncHandle(() => {
  return jsonAxios.get(`/api/wishlist`);
});

export const deleteWishlistFn = apiAsyncHandle((reqBody) => {
  return publicAxios.delete(`/api/wishlist`, { data: reqBody });
});
