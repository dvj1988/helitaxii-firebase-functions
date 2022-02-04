import { PilotCreateType, PilotFdtlRequestBodyType } from "@/types/pilot";
import { isNumber } from "lodash";
import isString from "lodash/isString";

export const isCreatePilotPayloadValid = (newPilot: PilotCreateType) => {
  if (!isString(newPilot.name)) {
    return false;
  }

  return true;
};

export const isCreatePilotFdtlValid = (newFdtl: PilotFdtlRequestBodyType) => {
  const { duty, dateInMs } = newFdtl;

  if (!isNumber(dateInMs)) {
    return false;
  }

  if (!Array.isArray(duty) || duty.length === 0) {
    return false;
  }

  let isValid = true;

  duty.every(
    ({
      endMinutesFromMidnight,
      startMinutesFromMidnight,
      sequence,
      flightDurationInMinutes,
    }) => {
      if (!isNumber(endMinutesFromMidnight)) {
        isValid = false;
        return false;
      }
      if (!isNumber(startMinutesFromMidnight)) {
        isValid = false;
        return false;
      }
      if (!isNumber(sequence)) {
        isValid = false;
        return false;
      }
      if (!isNumber(flightDurationInMinutes)) {
        isValid = false;
        return false;
      }
      return true;
    }
  );
  return isValid;
};
