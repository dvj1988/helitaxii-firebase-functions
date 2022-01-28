import { SERVER_ERROR_STATUS_CODE } from "@/constants/response";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";

export const getAircrafts = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const { airportRepository } = res.locals;
  try {
    const aircrafts = await airportRepository.list();
    return res.json(getSuccessResponse({ aircrafts }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
