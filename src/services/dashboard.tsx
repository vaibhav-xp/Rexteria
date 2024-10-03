import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const getDashboardFn = apiAsyncHandle(() => {
  return publicAxios.get("/api/dashboard");
});
