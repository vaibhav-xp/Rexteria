"use client";

import axios from "axios";
import { createContext, ReactNode, FC } from "react";

// Define the type for the context value
interface AxiosContextType {
  axiosInstance: () => ReturnType<typeof axios.create>;
}

// Create the context with a default value
export const AxiosContext = createContext<AxiosContextType | undefined>(
  undefined,
);

// Define the provider component with children prop
const AxiosContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const axiosInstance = () => {
    const baseAxios = axios.create({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return baseAxios;
  };

  return (
    <AxiosContext.Provider value={{ axiosInstance }}>
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosContextProvider;
