import publicAxios, { jsonAxios } from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const postEnquiryFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.post("/api/enquiry", reqBody);
});

export const getEnquiryFn = apiAsyncHandle(() => {
  return jsonAxios.get("/api/enquiry");
});

export const getEnquiryListFn = apiAsyncHandle((reqBody) => {
  return jsonAxios.get("/api/enquiry/all", {
    params: reqBody,
  });
});

export const postEnquiryStatusFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post("/api/enquiry/all", reqBody);
});

export const deleteEnquiryFn = apiAsyncHandle((reqBody) => {
  return publicAxios.delete("/api/enquiry/all", { data: reqBody });
});

export const historyFn = apiAsyncHandle((reqBody) => {
  return publicAxios.get("/api/history", { params: reqBody });
});
