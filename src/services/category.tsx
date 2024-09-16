import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const getCategoriesFn = apiAsyncHandle(() => {
  return publicAxios.get("/api/category");
});
