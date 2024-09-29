import { toast } from "@/hooks/use-toast";
import { UserType } from "@/types/store-types";
import { AxiosError, AxiosResponse } from "axios";

type AsyncFunction = (args?: object | string) => Promise<AxiosResponse>;

const apiAsyncHandle =
  (fn: AsyncFunction) => async (args?: object | string) => {
    try {
      const { data } = await fn(args);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Failed",
          description:
            error?.response?.data?.message ||
            error.message ||
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

export const loginFirst = (user: UserType | null, fn: () => void) => {
  if (user) {
    fn();
  } else {
    toast({
      title: "Failed",
      description: "Please log in to access this feature. ",
    });
  }
};

export default apiAsyncHandle;
