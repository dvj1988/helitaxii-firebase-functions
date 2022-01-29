import {
  SUCCESS,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
} from "@/constants/response";

export const getSuccessResponse = (data: any) => ({ status: SUCCESS, data });

// TODO: Reafactor status code enum
const getErrorMessage = (statusCode: 404 | 500 | 400) => {
  if (statusCode === NOT_FOUND_STATUS_CODE) {
    return "Resource Not Found";
  }

  if (statusCode === SERVER_ERROR_STATUS_CODE) {
    return "Something went wrong";
  }

  if (statusCode === BAD_REQUEST_STATUS_CODE) {
    return "Bad Request";
  }

  return "";
};

export const getErrorResponse = (statusCode: 404 | 500 | 400) => ({
  status: "ERROR",
  message: getErrorMessage(statusCode),
});
