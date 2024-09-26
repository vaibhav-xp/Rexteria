import publicAxios from "@/lib/axios";
import apiAsyncHandle from "./handle-api";

export const sendOtpFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post(`/api/otp`, reqBody);
});

export const verfiyOtpFn = apiAsyncHandle((reqBody) => {
  return publicAxios.post(`/api/otp/verify`, reqBody);
});

export const getOtpFn = apiAsyncHandle((reqBody) => {
  return publicAxios.get(`/api/otp`, { params: reqBody });
});
