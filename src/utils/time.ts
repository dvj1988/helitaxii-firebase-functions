import { firestore } from "firebase-admin";
import moment from "moment";

export const subtractDays = (
  date: FirebaseFirestore.Timestamp,
  numberOfDays: number,
  utcOffset = "+05:30"
): FirebaseFirestore.Timestamp => {
  const momentDay = moment(date.toMillis())
    .subtract(numberOfDays, "days")
    .utcOffset(utcOffset)
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0);

  return firestore.Timestamp.fromMillis(momentDay.valueOf());
};

export const addDays = (
  date: FirebaseFirestore.Timestamp,
  numberOfDays: number,
  utcOffset = "+05:30"
) => {
  const momentDay = moment(date.toMillis())
    .add(numberOfDays, "days")
    .utcOffset(utcOffset)
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0);

  return firestore.Timestamp.fromMillis(momentDay.valueOf());
};

export const differenceFirebaseDates = (
  date1: FirebaseFirestore.Timestamp,
  date2: FirebaseFirestore.Timestamp,
  unit: moment.unitOfTime.Diff = "days"
) => {
  return moment(date1.toMillis()).diff(moment(date2.toMillis()), unit);
};
