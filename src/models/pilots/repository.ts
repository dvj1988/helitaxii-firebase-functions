import { firestore } from "firebase-admin";
import moment from "moment";

import { PilotCreateType, PilotFdtlCreateType, PilotType } from "@/types/pilot";
import {
  FDTL_COLLECTION_NAME,
  ORGANISATIONS_COLLECTION_NAME,
  PILOTS_COLLECTION_NAME,
} from "@/constants/firestore";
import { calculateFlightTimesFromDuties } from "@/utils/fdtl";

export class PilotRepository {
  db: firestore.Firestore;

  constructor() {
    this.db = firestore();
  }

  list(organisationId: string) {
    const date = firestore.Timestamp.fromDate(new Date());
    console.log(date);
    console.log(
      "moment(date)",
      moment(date.toDate()).utcOffset("+05:30").format("DD/MM/YYYY HH:mm")
    );

    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PilotType))
      );
  }

  create(newPilot: PilotCreateType, organisationId: string) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .add(newPilot)
      .then(
        (d) =>
          ({
            id: d.id,
            ...newPilot,
          } as PilotType)
      );
  }

  getFdtl(
    { pilotId, id }: { pilotId: string; id: string },
    organisationId: string
  ) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .doc(pilotId)
      .collection(FDTL_COLLECTION_NAME)
      .doc(id)
      .get()
      .then((doc) => doc.data() as PilotFdtlCreateType | undefined);
  }

  updateFdtl(
    { id, pilotId, date, duty }: PilotFdtlCreateType,
    organisationId: string
  ) {
    const aggregate = calculateFlightTimesFromDuties(duty);

    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .doc(pilotId)
      .collection(FDTL_COLLECTION_NAME)
      .doc(id)
      .update({
        date: firestore.Timestamp.fromDate(date),
        duty,
        aggregate,
      })
      .then((d) => ({
        id,
        pilotId,
        date,
        duty,
        aggregate,
      }));
  }

  addFdtl(
    { id, pilotId, date, duty }: PilotFdtlCreateType,
    organisationId: string
  ) {
    const aggregate = calculateFlightTimesFromDuties(duty);

    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .doc(pilotId)
      .collection(FDTL_COLLECTION_NAME)
      .doc(id)
      .set({
        date: firestore.Timestamp.fromDate(date),
        duty,
        aggregate,
      })
      .then((d) => ({
        id,
        pilotId,
        date,
        duty,
        aggregate,
      }));
  }
}
