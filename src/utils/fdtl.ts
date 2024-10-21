import {
  PilotFdtlCreateType,
  PilotFdtlRequestBodyType,
  FlightDutyType,
  PilotFdtlListQueryType,
  FdtlListQueryType,
  PilotFdtlType,
} from "../types/pilot";
import moment from "moment";
import { differenceFirebaseDates } from "./time";
import { firestore } from "firebase-admin";
import fdtlDateThresholdStore from "./fdtlThresholdStore";

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

export const calculateFlightTimesFromDuties = ({
  duties,
  date,
}: {
  duties: FlightDutyType[];
  date: Date;
}) => {
  const fdtlAdditionalTime = fdtlDateThresholdStore.getValueForDate(date);
  // const fdtlAdditionalTime = 75;
  const newDuties = [...duties];
  const aggregate = { totalFlightDurationMins: 0, totalFlightDutyInMins: 0 };

  if (duties.length === 1) {
    aggregate.totalFlightDurationMins = duties[0].flightDurationInMinutes;
    aggregate.totalFlightDutyInMins =
      duties[0].endMinutesFromMidnight -
      duties[0].startMinutesFromMidnight +
      fdtlAdditionalTime;
  } else {
    // Sort the duties based on the sequence
    newDuties.sort((a, b) => a.sequence - b.sequence);
    const [firstDuty, secondDuty, thirdDuty] = newDuties;

    const lastDuty = thirdDuty || secondDuty;

    aggregate.totalFlightDurationMins =
      firstDuty.flightDurationInMinutes +
      secondDuty.flightDurationInMinutes +
      (thirdDuty?.flightDurationInMinutes || 0);

    // Calculate the total flight duty time
    aggregate.totalFlightDutyInMins =
      lastDuty.endMinutesFromMidnight -
      firstDuty.startMinutesFromMidnight +
      fdtlAdditionalTime;

    // Calculate the break time between the duties
    const firstBreakTime =
      secondDuty.startMinutesFromMidnight - firstDuty.endMinutesFromMidnight;

    // If the break time is greater than 3hrs then reduce 50% of break time from total flight duty time
    if (firstBreakTime >= 180) {
      aggregate.totalFlightDutyInMins -= Math.ceil(firstBreakTime / 2);
    }

    // Calculate the break time between the duties
    const secondBreakTime =
      thirdDuty?.startMinutesFromMidnight - secondDuty.endMinutesFromMidnight;

    // If the break time is greater than 3hrs then reduce 50% of break time from total flight duty time
    if (secondBreakTime >= 180) {
      aggregate.totalFlightDutyInMins -= Math.ceil(secondBreakTime / 2);
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

export const getParsedFdtlFilterQuery = (
  query: PilotFdtlListQueryType
): FdtlListQueryType => {
  const { startDateInMs, endDateInMs } = query;

  return {
    startDateInMs: parseInt(startDateInMs, 10),
    endDateInMs: parseInt(endDateInMs, 10),
  };
};

export const getAllDatesFdtls = (
  fdtls: PilotFdtlType[],
  startDateInMs: number,
  endDateInMs: number,
  pilotId: string
) => {
  const allFdtls: PilotFdtlType[] = [];

  for (
    let i = startDateInMs;
    i <= endDateInMs;
    i = moment(i).add(1, "days").valueOf()
  ) {
    const documentId = getFdtlDocumentId(i, "+05:30");

    const exisitingFdtl = fdtls.find(({ id }) => id === documentId) || {
      id: documentId,
      date: firestore.Timestamp.fromMillis(i),
      duty: [],
      pilotId,
      aggregate: {
        flightDutyInMins: {
          onDay: 0,
          days28: 0,
          days365: 0,
          days7: 0,
        },
        flightTimeInMins: {
          onDay: 0,
          days28: 0,
          days365: 0,
          days7: 0,
        },
      },
      updatedAt: null,
      createdAt: null,
      deletedAt: null,
    };

    const previousYearFdtls = fdtls.filter(
      ({ date }) =>
        differenceFirebaseDates(exisitingFdtl.date, date) < 365 &&
        differenceFirebaseDates(exisitingFdtl.date, date) > 0
    );

    const newFdtl = previousYearFdtls.reduce(
      (acc, curr) => {
        const isCurrentMonth =
          differenceFirebaseDates(exisitingFdtl.date, curr.date) < 28;

        const isCurrentWeek =
          differenceFirebaseDates(exisitingFdtl.date, curr.date) < 7;

        const accAggregateFlightDuty = acc.aggregate.flightDutyInMins;
        const accAggregateFlightTime = acc.aggregate.flightTimeInMins;

        const currentAggregateFlightDuty = curr.aggregate.flightDutyInMins;
        const currentAggregateFlightTime = curr.aggregate.flightTimeInMins;

        return {
          ...acc,
          aggregate: {
            flightDutyInMins: {
              ...accAggregateFlightDuty,
              days7:
                accAggregateFlightDuty.days7 +
                (isCurrentWeek ? currentAggregateFlightDuty.onDay : 0),
              days28:
                accAggregateFlightDuty.days28 +
                (isCurrentMonth ? currentAggregateFlightDuty.onDay : 0),
              days365:
                accAggregateFlightDuty.days365 +
                currentAggregateFlightDuty.onDay,
            },
            flightTimeInMins: {
              ...accAggregateFlightTime,
              days7:
                accAggregateFlightTime.days7 +
                (isCurrentWeek ? currentAggregateFlightTime.onDay : 0),
              days28:
                accAggregateFlightTime.days28 +
                (isCurrentMonth ? currentAggregateFlightTime.onDay : 0),
              days365:
                accAggregateFlightTime.days365 +
                currentAggregateFlightTime.onDay,
            },
          },
        };
      },
      {
        ...exisitingFdtl,
        aggregate: {
          flightDutyInMins: {
            ...exisitingFdtl.aggregate.flightDutyInMins,
            days28: exisitingFdtl.aggregate.flightDutyInMins.onDay,
            days365: exisitingFdtl.aggregate.flightDutyInMins.onDay,
            days7: exisitingFdtl.aggregate.flightDutyInMins.onDay,
          },
          flightTimeInMins: {
            ...exisitingFdtl.aggregate.flightTimeInMins,
            days28: exisitingFdtl.aggregate.flightTimeInMins.onDay,
            days365: exisitingFdtl.aggregate.flightTimeInMins.onDay,
            days7: exisitingFdtl.aggregate.flightTimeInMins.onDay,
          },
        },
      }
    );

    allFdtls.push(newFdtl);
  }

  return allFdtls;
};
