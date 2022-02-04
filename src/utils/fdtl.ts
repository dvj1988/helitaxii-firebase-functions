import {
  PilotFdtlCreateType,
  PilotFdtlRequestBodyType,
  FlightDutyType,
} from "@/types/pilot";
import moment from "moment";

export const getFdtlDocumentId = (dateInMs: number, utcOffset: string) => {
  return moment(dateInMs).utcOffset(utcOffset).format("DD-MM-YYYY");
};

export const createFdtlFirestoreInput = (
  fdtlRequestBody: PilotFdtlRequestBodyType,
  pilotId: string,
  utcOffset: string
): PilotFdtlCreateType => {
  const { dateInMs, duty } = fdtlRequestBody;

  const id = getFdtlDocumentId(dateInMs, utcOffset);

  return {
    id,
    pilotId,
    date: new Date(dateInMs),
    duty,
  };
};

export const calculateFlightTimesFromDuties = (duties: FlightDutyType[]) => {
  const newDuties = [...duties];
  const aggregate = { totalFlightDurationMins: 0, totalFlightDutyInMins: 0 };

  if (duties.length === 1) {
    aggregate.totalFlightDurationMins = duties[0].flightDurationInMinutes;
    // Flight duty time starts 45mins before start and ends 30 mins after end.
    // Hence add 75 mins in total
    aggregate.totalFlightDutyInMins =
      duties[0].endMinutesFromMidnight -
      duties[0].startMinutesFromMidnight +
      75;
  } else {
    // Sort the duties based on the sequence
    newDuties.sort((a, b) => a.sequence - b.sequence);
    const [firstDuty, secondDuty] = newDuties;

    aggregate.totalFlightDurationMins =
      firstDuty.flightDurationInMinutes + secondDuty.flightDurationInMinutes;

    // Calculate the total flight duty time
    aggregate.totalFlightDutyInMins =
      secondDuty.endMinutesFromMidnight -
      firstDuty.startMinutesFromMidnight +
      75;

    // Calculate the break time between the duties
    const breakTime =
      secondDuty.startMinutesFromMidnight - firstDuty.endMinutesFromMidnight;

    // If the break time is greater than 3hrs then reduce 50% of break time from total flight duty time
    if (breakTime >= 180) {
      aggregate.totalFlightDutyInMins - Math.ceil(breakTime / 2);
    }
  }

  return {
    flightDutyInMins: {
      onDay: aggregate.totalFlightDutyInMins,
      days7: 0,
      days28: 0,
      days365: 0,
    },
    flightTimeInMins: {
      onDay: aggregate.totalFlightDurationMins,
      days7: 0,
      days28: 0,
      days365: 0,
    },
  };
};
