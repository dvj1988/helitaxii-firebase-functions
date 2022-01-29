import { MachineCreateType, MachineTypeEnum } from "@/types/machine";
import isString from "lodash/isString";

export const isCreateMachinePayloadValid = (newMachine: MachineCreateType) => {
  if (!isString(newMachine.name)) {
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
