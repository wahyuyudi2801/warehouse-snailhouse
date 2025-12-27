/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data.errors;
  } else {
    return {
      message: ["Something went wrong. Please try again."],
    };
  }
};

export default axiosError;
