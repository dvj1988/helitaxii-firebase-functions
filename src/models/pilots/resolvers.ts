import { SERVER_ERROR_STATUS_CODE } from "@/constants/response";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";

export const getPilots = async (req: ExpressRequest, res: ExpressResponse) => {
  const { pilotRepository } = res.locals;
  try {
    const pilots = await pilotRepository.list();
    return res.json(getSuccessResponse({ pilots }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
