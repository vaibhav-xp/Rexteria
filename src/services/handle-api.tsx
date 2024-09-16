import { toast } from "@/hooks/use-toast";

const apiAsyncHandle = (fn) => async () => {
  try {
    const { data } = await fn();
    return data;
  } catch (error) {
    toast({
      title: "Failed",
      description:
        error.message ||
        error?.response?.data?.message ||
        "An unexpected error occurred.",
    });
    throw error;
  }
};

export default apiAsyncHandle;
