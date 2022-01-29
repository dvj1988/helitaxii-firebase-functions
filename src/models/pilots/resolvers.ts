import {
  BAD_REQUEST_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { OrganisationParamsType } from "@/types/organisation";
import { PilotCreateType } from "@/types/pilot";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import { isCreatePilotPayloadValid } from "./validators";

export const getPilots = async (
  req: ExpressRequest<OrganisationParamsType>,
  res: ExpressResponse
) => {
  const { pilotRepository } = res.locals;
  const { params } = req;
  const { organisationId } = params;

  try {
    const pilots = await pilotRepository.list(organisationId);
    return res.json(getSuccessResponse({ pilots, organisationId }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};

export const createPilot = async (
  req: ExpressRequest<OrganisationParamsType, {}, PilotCreateType>,
  res: ExpressResponse
) => {
  const { pilotRepository } = res.locals;

  const { body, params } = req;

  const newPilot = pick(body, ["name"]);
  const { organisationId } = params;

  if (!isCreatePilotPayloadValid(newPilot)) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    const pilot = await pilotRepository.create(newPilot, organisationId);
    return res.json(getSuccessResponse({ pilot, organisationId }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
