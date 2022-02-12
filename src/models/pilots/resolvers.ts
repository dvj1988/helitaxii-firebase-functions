import {
  BAD_REQUEST_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import {
  PilotCreateType,
  PilotFdtlRequestBodyType,
  PilotParamsType,
} from "@/types/pilot";
import { createFdtlFirestoreInput } from "@/utils/fdtl";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import {
  isCreatePilotFdtlValid,
  isCreatePilotPayloadValid,
} from "./validators";

export const getPilots = async (req: ExpressRequest, res: ExpressResponse) => {
  const { pilotRepository, organisationId } = res.locals;

  if (!organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

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
  req: ExpressRequest<{}, {}, PilotCreateType>,
  res: ExpressResponse
) => {
  const { pilotRepository, organisationId } = res.locals;

  const { body } = req;

  const newPilot = pick(body, ["name"]);

  if (!isCreatePilotPayloadValid(newPilot) || !organisationId) {
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

export const createPilotFdtl = async (
  req: ExpressRequest<PilotParamsType, {}, PilotFdtlRequestBodyType>,
  res: ExpressResponse
) => {
  const { pilotRepository, organisationId } = res.locals;

  const { body, params } = req;

  const fdtlPayload = pick(body, ["dateInMs", "duty"]);

  const { pilotId } = params;

  if (!isCreatePilotFdtlValid(fdtlPayload) || !organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  const newFdtl = createFdtlFirestoreInput(fdtlPayload, pilotId, "+05:30");

  try {
    const existingFdtl = await pilotRepository.getFdtl(
      { id: newFdtl.id, pilotId: newFdtl.pilotId },
      organisationId
    );

    if (existingFdtl) {
      const pilot = await pilotRepository.updateFdtl(newFdtl, organisationId);
      return res.json(getSuccessResponse({ pilot, organisationId }));
    }
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }

  try {
    const pilot = await pilotRepository.addFdtl(newFdtl, organisationId);
    return res.json(getSuccessResponse({ pilot, organisationId }));
  } catch (err) {
    console.log(err);
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
