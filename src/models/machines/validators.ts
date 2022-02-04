import { MachineCreateType, MachineTypeEnum } from "@/types/machine";
import isString from "lodash/isString";

export const isCreateMachinePayloadValid = (newMachine: MachineCreateType) => {
  if (!isString(newMachine.callSign)) {
    return false;
  }

  if (!isString(newMachine.modelNo)) {
    return false;
  }

  if (
    ![MachineTypeEnum.AIRCRAFT, MachineTypeEnum.HELICOPTER].includes(
      newMachine.type
    )
  ) {
    return false;
  }

  return true;
};
