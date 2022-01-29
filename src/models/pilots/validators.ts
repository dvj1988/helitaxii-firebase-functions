import { PilotCreateType } from "@/types/pilot";
import isString from "lodash/isString";

export const isCreatePilotPayloadValid = (newPilot: PilotCreateType) => {
  if (!isString(newPilot.name)) {
    return false;
  }

  return true;
};
