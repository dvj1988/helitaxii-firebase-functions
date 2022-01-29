export type MachineFirebaseType = {
  name: string;
  type: MachineTypeEnum;
};

export type MachineType = { id: string } & MachineFirebaseType;

export type MachineCreateType = {
  name: string;
  type: MachineTypeEnum;
};

export enum MachineTypeEnum {
  "HELICOPTER" = "HELICOPTER",
  "AIRCRAFT" = "AIRCRAFT",
}
