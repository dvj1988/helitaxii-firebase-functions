import {
  BAD_REQUEST_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { OrganisationCreateType } from "@/types/organisation";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import { isCreateOrganisationPayloadValid } from "./validators";

export const getOrganisations = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const { organisationRepository } = res.locals;
  try {
    const organisations = await organisationRepository.list();
    return res.json(getSuccessResponse({ organisations }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};

export const createOrganisaton = async (
  req: ExpressRequest<{}, {}, OrganisationCreateType>,
  res: ExpressResponse
) => {
  const { organisationRepository } = res.locals;

  const { body } = req;

  const newOrganisation = pick(body, ["name"]);

  if (!isCreateOrganisationPayloadValid(newOrganisation)) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    const organisation = await organisationRepository.create(newOrganisation);
    return res.json(getSuccessResponse({ organisation }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
