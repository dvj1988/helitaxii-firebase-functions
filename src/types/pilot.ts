export type PilotFirebaseType = {
  name: string;
  deletedAt: FirebaseFirestore.Timestamp | null;
  createdAt: FirebaseFirestore.Timestamp;
};

export type PilotType = { id: string } & PilotFirebaseType;

export type PilotCreateType = {
  name: string;
};

export type FlightDutyType = {
  startMinutesFromMidnight: number;
  endMinutesFromMidnight: number;
  flightDurationInMinutes: number;
  sequence: number;
  machineId: string;
};

export type PilotFdtlRequestBodyType = {
  dateInMs: number;
  duty: FlightDutyType[];
};

export type PilotFdtlListQueryType = {
  startDateInMs: string;
  endDateInMs: string;
};

export type PilotFdtlCreateType = {
  id: string;
  pilotId: string;
  date: Date;
  duty: FlightDutyType[];
};

export type PilotFdtlFirebaseType = Omit<PilotFdtlCreateType, "date"> & {
  date: FirebaseFirestore.Timestamp;
  aggregate: FdtlAggregateType;
  duty: FlightDutyType[];
};

export type FdtlAggregateType = {
  flightDutyInMins: {
    onDay: number;
    days7: number;
    days28: number;
    days365: number;
  };
  flightTimeInMins: {
    onDay: number;
    days7: number;
    days28: number;
    days365: number;
  };
};

export type PilotParamsType = {
  pilotId: string;
};

export type FdtlListQueryType = {
  startDateInMs: number;
  endDateInMs: number;
};

export type PilotFdtlType = PilotFdtlFirebaseType & { id: string };
