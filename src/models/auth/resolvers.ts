import { SERVER_ERROR_STATUS_CODE } from "@/constants/response";
import { CreateUserRequestBodyType } from "@/types/auth";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";

export const createUser = async (
  req: ExpressRequest<{}, {}, CreateUserRequestBodyType>,
  res: ExpressResponse
) => {
  const { organisationId } = res.locals;

  try {
    // const machines = await machineRepository.list(organisationId);
    return res.json(getSuccessResponse({ organisationId }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
