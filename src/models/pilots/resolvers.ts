import {
  BAD_REQUEST_STATUS_CODE,
  MSG_INVALID_ORGANISATION_ID,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { PaginationQueryTypeOrNull } from "@/types/common";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import {
  PilotCreateType,
  PilotFdtlRequestBodyType,
  PilotParamsType,
} from "@/types/pilot";
import { createFdtlFirestoreInput } from "@/utils/fdtl";
import { getParsedPaginationParams } from "@/utils/pagination";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import {
  isCreatePilotFdtlValid,
  isCreatePilotPayloadValid,
} from "./validators";

export const getPilots = async (
  req: ExpressRequest<{}, {}, {}, PaginationQueryTypeOrNull>,
  res: ExpressResponse
) => {
  const { pilotRepository, organisationId } = res.locals;
  const { pageNumber, pageSize } = getParsedPaginationParams(req.query);

  if (!organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(
        getErrorResponse(BAD_REQUEST_STATUS_CODE, MSG_INVALID_ORGANISATION_ID)
      );
  }

  try {
    const pilots = await pilotRepository.list(organisationId, {
      pageNumber,
      pageSize,
    });

    const { totalCount } = await pilotRepository.getTotalCount(organisationId);

    return res.json(
      getSuccessResponse({
        pilots,
        organisationId,
        pageInfo: {
          pageNumber,
          pageSize,
          totalCount,
        },
      })
    );
  } catch (err) {
    console.log(err);
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

export const getPilot = async (
  req: ExpressRequest<PilotParamsType>,
  res: ExpressResponse
) => {
  const { pilotRepository, organisationId } = res.locals;

  const { params } = req;

  const { pilotId } = params;

  if (!pilotId || !organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    const pilot = await pilotRepository.getById(organisationId, pilotId);
    return res.json(getSuccessResponse({ pilot, organisationId }));
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }
};

export const deletePilot = async (
  req: ExpressRequest<PilotParamsType>,
  res: ExpressResponse
) => {
  const { pilotRepository, organisationId } = res.locals;

  const { params } = req;

  const { pilotId } = params;

  if (!pilotId || !organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    await pilotRepository.getById(organisationId, pilotId);
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  try {
    await pilotRepository.deleteById(organisationId, pilotId);
    return res.json(getSuccessResponse({ pilotId, organisationId }));
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
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
