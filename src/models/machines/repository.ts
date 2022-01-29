import { firestore } from "firebase-admin";
import { MachineType, MachineCreateType } from "@/types/machine";
import {
  MACHINES_COLLECTION_NAME,
  ORGANISATIONS_COLLECTION_NAME,
} from "@/constants/firestore";

export class MachineRepository {
  db: firestore.Firestore;
  collectionName: string;
  organisationCollectionName: string;

  constructor() {
    this.db = firestore();
    this.collectionName = MACHINES_COLLECTION_NAME;
    this.organisationCollectionName = ORGANISATIONS_COLLECTION_NAME;
  }

  list(organisationId: string) {
    return this.db
      .collection(this.organisationCollectionName)
      .doc(organisationId)
      .collection(this.collectionName)
      .get()
      .then((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as MachineType)
        )
      );
  }

  create(newMachine: MachineCreateType, organisationId: string) {
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
}
