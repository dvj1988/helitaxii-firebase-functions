import * as functions from "firebase-functions";
import { FdtlAggregateType, PilotFdtlFirebaseType } from "@/types/pilot";
import { isEqual, cloneDeep, isUndefined } from "lodash";
import { addDays, differenceFirebaseDates, subtractDays } from "@/utils/time";

export const pilotFdtlOnWriteTrigger: (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => any = async (change, context) => {
  const newData = change.after.data() as PilotFdtlFirebaseType;
  const previousData = change.before.data() as PilotFdtlFirebaseType;

  const operation = isUndefined(newData)
    ? "DELETE"
    : isUndefined(previousData)
    ? "CREATE"
    : "UPDATE";

  // No changes required if the duty object is unchanged
  if (operation === "UPDATE" && isEqual(previousData.duty, newData.duty)) {
    return null;
  }

  // Get reference to the db
  const db = change.after.ref.firestore;

  const updateFutureFdtlTransaction = db.runTransaction(async (t) => {
    const currentDate =
      operation === "DELETE" ? previousData.date : newData.date;

    const changeInFlightDuty =
      operation === "CREATE"
        ? newData.aggregate.flightDutyInMins.onDay
        : operation === "UPDATE"
        ? newData.aggregate.flightDutyInMins.onDay -
          previousData.aggregate.flightDutyInMins.onDay
        : -previousData.aggregate.flightDutyInMins.onDay;

    const changeInFlightTime =
      operation === "CREATE"
        ? newData.aggregate.flightTimeInMins.onDay
        : operation === "UPDATE"
        ? newData.aggregate.flightTimeInMins.onDay -
          previousData.aggregate.flightTimeInMins.onDay
        : -previousData.aggregate.flightTimeInMins.onDay;

    const currentDatePlus364Days = addDays(currentDate, 364);

    // Get all the fdtls 364 days after the current date
    const nextYearFdtls = await t.get(
      change.after.ref.parent
        .where("date", "<=", currentDatePlus364Days)
        .where("date", ">", currentDate)
    );

    // Iterate through all the fdtls
    nextYearFdtls.forEach((doc) => {
      const data = doc.data() as PilotFdtlFirebaseType;

      const updatedAggregate = cloneDeep(data.aggregate);

      // Update the 365 day aggregate
      updatedAggregate.flightDutyInMins.days365 += changeInFlightDuty;
      updatedAggregate.flightTimeInMins.days365 += changeInFlightTime;

      // If the difference in date is <= 28 then update days28 aggregate
      if (differenceFirebaseDates(data.date, currentDate) < 28) {
        updatedAggregate.flightDutyInMins.days28 += changeInFlightDuty;
        updatedAggregate.flightTimeInMins.days28 += changeInFlightTime;
      }

      // If the difference in date is <= 7 then update days28 aggregate
      if (differenceFirebaseDates(data.date, currentDate) < 7) {
        updatedAggregate.flightDutyInMins.days7 += changeInFlightDuty;
        updatedAggregate.flightTimeInMins.days7 += changeInFlightTime;
      }

      // Add the update to the transaction
      t.update(doc.ref, {
        aggregate: updatedAggregate,
      } as { aggregate: FdtlAggregateType });
    });
  });

  if (operation === "DELETE") {
    return updateFutureFdtlTransaction;
  }

  const updateCurrentObjectTransaction = db.runTransaction(async (t) => {
    const currentDate = newData.date;
    const currentAggregate = cloneDeep(newData.aggregate);

    const currentDateMinus364Days = subtractDays(currentDate, 364);

    // Get all fdtl for previous 364 days from the date for which the trigger was run
    const lastYearFdtls = await t.get(
      change.after.ref.parent
        .where("date", ">=", currentDateMinus364Days)
        .where("date", "<", currentDate)
    );

    currentAggregate.flightDutyInMins.days365 +=
      currentAggregate.flightDutyInMins.onDay;
    currentAggregate.flightDutyInMins.days7 +=
      currentAggregate.flightDutyInMins.onDay;
    currentAggregate.flightDutyInMins.days28 +=
      currentAggregate.flightDutyInMins.onDay;

    currentAggregate.flightTimeInMins.days365 +=
      currentAggregate.flightTimeInMins.onDay;
    currentAggregate.flightTimeInMins.days7 +=
      currentAggregate.flightTimeInMins.onDay;
    currentAggregate.flightTimeInMins.days28 +=
      currentAggregate.flightTimeInMins.onDay;

    // Iterate through the fdtls and update the aggregate values for (last 7, 28 and 365 days) for the current date
    lastYearFdtls.forEach((doc) => {
      const data = doc.data() as PilotFdtlFirebaseType;
      const {
        aggregate: { flightTimeInMins, flightDutyInMins },
      } = data;

      currentAggregate.flightDutyInMins.days365 += flightDutyInMins.onDay;
      currentAggregate.flightTimeInMins.days365 += flightTimeInMins.onDay;

      if (differenceFirebaseDates(currentDate, data.date) < 28) {
        currentAggregate.flightDutyInMins.days28 += flightDutyInMins.onDay;
        currentAggregate.flightTimeInMins.days28 += flightTimeInMins.onDay;
      }

      if (differenceFirebaseDates(currentDate, data.date) < 7) {
        currentAggregate.flightDutyInMins.days7 += flightDutyInMins.onDay;
        currentAggregate.flightTimeInMins.days7 += flightTimeInMins.onDay;
      }
    });

    // Add the update to the db transaction
    t.update(change.after.ref, { aggregate: currentAggregate });
  });

  return Promise.all([
    updateCurrentObjectTransaction,
    updateFutureFdtlTransaction,
  ]);
};
