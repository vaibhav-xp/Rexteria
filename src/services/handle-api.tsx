import { toast } from "@/hooks/use-toast";
import { AxiosError, AxiosResponse } from "axios";

type AsyncFunction = (args?: object) => Promise<AxiosResponse>;

const apiAsyncHandle = (fn: AsyncFunction) => async (args?: object) => {
  try {
    const { data } = await fn(args);
    return data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      toast({
        title: "Failed",
        description:
          error.message ||
          error?.response?.data?.message ||
          "An unexpected error occurred.",
      });
    } else {
      toast({
        title: "Failed",
        description: "An unexpected error occurred.",
      });
    }
    throw error;
  }
};

interface ShowAlert {
  data?: unknown;
  message: string;
  statusCode: number;
}
export const showAlert = (data: ShowAlert) => {
  toast({
    title: "Success",
    description: data?.message,
  });
};

export default apiAsyncHandle;
