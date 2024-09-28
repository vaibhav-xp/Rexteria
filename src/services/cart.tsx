import publicAxios, { jsonAxios } from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const addToCartFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post(`/api/cart`, reqBody);
});

export const getCartFn = apiAsyncHandle(() => {
  return jsonAxios.get(`/api/cart`);
});

export const patchCartFn = apiAsyncHandle((reqBody) => {
  return publicAxios.patch(`/api/cart`, reqBody);
});

export const deleteCartFn = apiAsyncHandle((reqBody) => {
  return publicAxios.delete(`/api/cart`, { data: reqBody });
});
