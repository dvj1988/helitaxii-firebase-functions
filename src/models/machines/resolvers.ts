import {
  BAD_REQUEST_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { MachineCreateType } from "@/types/machine";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import { isCreateMachinePayloadValid } from "./validators";

export const getMachines = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const { machineRepository, organisationId } = res.locals;

  console.log(organisationId);

  if (!organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

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
  req: ExpressRequest<{}, {}, MachineCreateType>,
  res: ExpressResponse
) => {
  const { machineRepository, organisationId } = res.locals;

  const { body } = req;

  const newMachine = pick(body, ["callSign", "type", "modelNo"]);

  if (!isCreateMachinePayloadValid(newMachine) || !organisationId) {
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
