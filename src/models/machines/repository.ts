import { firestore } from "firebase-admin";
import { MachineType, MachineCreateType } from "@/types/machine";
import {
  MACHINES_COLLECTION_NAME,
  AGGREGATES_COLLECTION_NAME,
  DOC_NOT_FOUND,
  ORGANISATIONS_COLLECTION_NAME,
} from "@/constants/firestore";
import { CollectionStatsDocType, PaginationTypeOrNull } from "@/types/common";

export class MachineRepository {
  db: firestore.Firestore;
  collectionName: string;
  organisationCollectionName: string;

  constructor() {
    this.db = firestore();
    this.collectionName = MACHINES_COLLECTION_NAME;
    this.organisationCollectionName = ORGANISATIONS_COLLECTION_NAME;
  }

  async getById(organisationId: string, machineId: string) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(MACHINES_COLLECTION_NAME)
      .doc(machineId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return {
            id: doc.id,
            ...doc.data(),
          } as MachineType;
        }

        throw new Error(DOC_NOT_FOUND);
      });
  }

  list(organisationId: string, { pageNumber, pageSize }: PaginationTypeOrNull) {
    const query = this.db
      .collection(this.organisationCollectionName)
      .doc(organisationId)
      .collection(this.collectionName)
      .orderBy("createdAt", "desc")
      .where("deletedAt", "==", null);

    if (pageNumber && pageSize) {
      query.limit(pageSize).offset((pageNumber - 1) * pageSize);
    }
    return query
      .get()
      .then((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as MachineType)
        )
      );
  }

  getTotalCount(organisationId: string) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(AGGREGATES_COLLECTION_NAME)
      .doc(MACHINES_COLLECTION_NAME)
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

  create(machineObj: MachineCreateType, organisationId: string) {
    const createdAt = firestore.Timestamp.now();
    const newMachine = {
      ...machineObj,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    };

    return this.db
      .collection(this.organisationCollectionName)
      .doc(organisationId)
      .collection(this.collectionName)
      .add(newMachine)
      .then(
        (d) =>
          ({
            id: d.id,
            ...newMachine,
          } as MachineType)
      );
  }

  deleteById(organisationId: string, machineId: string) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(MACHINES_COLLECTION_NAME)
      .doc(machineId)
      .update({
        deletedAt: firestore.Timestamp.now(),
        updatedAt: firestore.Timestamp.now(),
      });
  }

  updateById(
    organisationId: string,
    machineId: string,
    machineObj: MachineCreateType
  ) {
    return this.db
      .collection(ORGANISATIONS_COLLECTION_NAME)
      .doc(organisationId)
      .collection(MACHINES_COLLECTION_NAME)
      .doc(machineId)
      .update({
        ...machineObj,
        updatedAt: firestore.Timestamp.now(),
      });
  }
}
