export type PilotFirebaseType = {
  name: string;
};

export type PilotType = { id: string } & PilotFirebaseType;

export type PilotCreateType = {
  name: string;
};

export type PilotFdtlRequestBodyType = {
  dateInMs: number;
  duty: FlightDutyType[];
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

export type FlightDutyType = {
  startMinutesFromMidnight: number;
  endMinutesFromMidnight: number;
  flightDurationInMinutes: number;
  sequence: number;
};
