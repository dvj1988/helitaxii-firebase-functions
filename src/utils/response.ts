import {
  SUCCESS,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";

export const getSuccessResponse = (data: any) => ({ status: SUCCESS, data });

const getErrorMessage = (statusCode: 404 | 500) => {
  if (statusCode === NOT_FOUND_STATUS_CODE) {
    return "Resource Not Found";
  }

  if (statusCode === SERVER_ERROR_STATUS_CODE) {
    return "Something went wrong";
  }

  return "";
};

export const getErrorResponse = (statusCode: 404 | 500) => ({
  status: "ERROR",
  message: getErrorMessage(statusCode),
});
