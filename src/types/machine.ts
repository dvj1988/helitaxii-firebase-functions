export type MachineCreateType = {
  callSign: string;
  type: MachineTypeEnum;
  modelNo: string;
};

export type MachineFirebaseType = MachineCreateType;
export type MachineType = { id: string } & MachineFirebaseType;

export enum MachineTypeEnum {
  "HELICOPTER" = "HELICOPTER",
  "AIRCRAFT" = "AIRCRAFT",
}
