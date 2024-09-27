import publicAxios, { jsonAxios } from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const getUserFn = apiAsyncHandle(() => {
  return jsonAxios.get("/api/user");
});

export const patchUserFn = apiAsyncHandle((reqBody) => {
  return publicAxios.patch("/api/user", reqBody);
});

export const getAllUsersFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.get("/api/user/all", {
    params: reqBody,
  });
});

export const postUsersStatusFn = apiAsyncHandle((reqBody) => {
  return publicAxios.patch("/api/user/all", reqBody);
});
