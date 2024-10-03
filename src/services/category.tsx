import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const getCategoriesFn = apiAsyncHandle(() => {
  return publicAxios.get("/api/category");
});

export const postCategoryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post("/api/category", reqBody);
});

export const patchCategoryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.patch("/api/category", reqBody);
});

export const deleteCategoryByIdFn = apiAsyncHandle((reqBody) => {
  return publicAxios.delete(`/api/category`, { data: reqBody });
});
