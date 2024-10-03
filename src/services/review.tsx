import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const postViewsFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post("/api/review", reqBody);
});

export const patchRatingFn = apiAsyncHandle((reqBody) => {
  return publicAxios.patch("/api/review", reqBody);
});

export const getRatingFn = apiAsyncHandle((reqBody) => {
  return publicAxios.get("/api/review", { params: reqBody });
});

export const getReviewsFn = apiAsyncHandle((reqBody) => {
  return publicAxios.get("/api/review/all", { params: reqBody });
});
