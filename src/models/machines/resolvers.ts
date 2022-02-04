import {
  BAD_REQUEST_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { MachineCreateType } from "@/types/machine";
import { OrganisationParamsType } from "@/types/organisation";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import { isCreateMachinePayloadValid } from "./validators";

export const getMachines = async (
  req: ExpressRequest<OrganisationParamsType>,
  res: ExpressResponse
) => {
  const { machineRepository } = res.locals;
  const {
    params: { organisationId },
  } = req;

  try {
    const machines = await machineRepository.list(organisationId);
    return res.json(getSuccessResponse({ machines, organisationId }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};

export const createMachine = async (
  req: ExpressRequest<OrganisationParamsType, {}, MachineCreateType>,
  res: ExpressResponse
) => {
  const { machineRepository } = res.locals;

  const { body, params } = req;

  const newMachine = pick(body, ["callSign", "type", "modelNo"]);
  const { organisationId } = params;

  if (!isCreateMachinePayloadValid(newMachine)) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    const machine = await machineRepository.create(newMachine, organisationId);
    return res.json(getSuccessResponse({ machine, organisationId }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
