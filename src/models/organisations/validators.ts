import { OrganisationCreateType } from "@/types/organisation";
import isString from "lodash/isString";

export const isCreateOrganisationPayloadValid = (
  newOrganisation: OrganisationCreateType
) => {
  if (!isString(newOrganisation.name)) {
    return false;
  }

  return true;
};
