import { firestore } from "firebase-admin";

import { PilotCreateType, PilotFdtlCreateType, PilotType } from "@/types/pilot";
import {
  AGGREGATES_COLLECTION_NAME,
  DOC_NOT_FOUND,
  FDTL_COLLECTION_NAME,
  ORGANISATIONS_COLLECTION_NAME,
  PILOTS_COLLECTION_NAME,
} from "@/constants/firestore";
import { calculateFlightTimesFromDuties } from "@/utils/fdtl";
import { CollectionStatsDocType, PaginationType } from "@/types/common";

export class PilotRepository {
  db: firestore.Firestore;

  constructor() {
    this.db = firestore();
  }

  async getById(organisationId: string, pilotId: string) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .doc(pilotId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }

        throw new Error(DOC_NOT_FOUND);
      });
  }

  list(organisationId: string, { pageNumber, pageSize }: PaginationType) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .orderBy("createdAt", "desc")
      .where("deletedAt", "==", null)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PilotType))
      );
  }

  deleteById(organisationId: string, pilotId: string) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .doc(pilotId)
      .update({
        deletedAt: firestore.Timestamp.now(),
      });
  }

  getTotalCount(organisationId: string) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(AGGREGATES_COLLECTION_NAME)
      .doc(PILOTS_COLLECTION_NAME)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data() as CollectionStatsDocType;
        }

        return {
          totalCount: 0,
        };
      });
  }

  create(pilotObj: PilotCreateType, organisationId: string) {
    const createdAt = firestore.Timestamp.now();
    const newPilot = {
      ...pilotObj,
      createdAt,
      deletedAt: null,
    };

    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(PILOTS_COLLECTION_NAME)
      .add(newPilot)
      .then(
        (d) =>
          ({
            ...newPilot,
            id: d.id,
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
