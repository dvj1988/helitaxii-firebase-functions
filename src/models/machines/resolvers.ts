import {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { PaginationQueryType } from "@/types/common";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { MachineCreateType, MachineParamsType } from "@/types/machine";
import { getParsedPaginationParams } from "@/utils/pagination";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import { isCreateMachinePayloadValid } from "./validators";

export const getMachines = async (
  req: ExpressRequest<{}, {}, {}, PaginationQueryType>,
  res: ExpressResponse
) => {
  const { machineRepository, organisationId } = res.locals;
  const { pageNumber, pageSize } = getParsedPaginationParams(req.query);

  if (!organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    const machines = await machineRepository.list(organisationId, {
      pageNumber,
      pageSize,
    });

    const { totalCount } = await machineRepository.getTotalCount(
      organisationId
    );

    return res.json(
      getSuccessResponse({
        machines,
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

export const getMachine = async (
  req: ExpressRequest<MachineParamsType>,
  res: ExpressResponse
) => {
  const { machineRepository, organisationId } = res.locals;

  const { params } = req;

  const { machineId } = params;

  if (!machineId || !organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    const machine = await machineRepository.getById(organisationId, machineId);
    return res.json(getSuccessResponse({ machine, organisationId }));
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }
};

export const deleteMachine = async (
  req: ExpressRequest<MachineParamsType>,
  res: ExpressResponse
) => {
  const { machineRepository, organisationId } = res.locals;

  const { params } = req;

  const { machineId } = params;

  if (!machineId || !organisationId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    await machineRepository.getById(organisationId, machineId);
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  try {
    await machineRepository.deleteById(organisationId, machineId);
    return res.json(getSuccessResponse({ machineId, organisationId }));
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }
};
