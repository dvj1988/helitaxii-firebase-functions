export type MachineCreateType = {
  callSign: string;
  type: MachineTypeEnum;
  modelNo: string;
};

export type MachineFirebaseType = MachineCreateType & {
  deletedAt: FirebaseFirestore.Timestamp | null;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

export type MachineType = { id: string } & MachineFirebaseType;

export enum MachineTypeEnum {
  "HELICOPTER" = "HELICOPTER",
  "AIRCRAFT" = "AIRCRAFT",
}

export type MachineParamsType = {
  machineId: string;
};
