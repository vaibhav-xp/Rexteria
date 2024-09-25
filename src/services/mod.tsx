import publicAxios, { jsonAxios } from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const postModsFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.post("/api/mod", reqBody);
});

export const patchModsFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.patch("/api/mod", reqBody);
});

export const getModsFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.get("/api/mod", {
    params: reqBody,
  });
});

export const getPublicModsFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.get("/api/mod/public", {
    params: reqBody,
  });
});

export const deleteModsFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.delete(`/api/mod`, {
    params: reqBody,
  });
});

export const statusModsFn = apiAsyncHandle((reqBody) => {
  return publicAxios.patch(`/api/mod/status`, reqBody);
});

export const getModByIdFn = apiAsyncHandle((_id) => {
  return publicAxios.get(`/api/mod/${_id}`);
});

export const getModBySlugFn = apiAsyncHandle((slug) => {
  return publicAxios.get(`/api/mod/public/${slug}`);
});
