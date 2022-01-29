import { firestore } from "firebase-admin";
import { PilotCreateType, PilotType } from "@/types/pilot";
import {
  ORGANISATIONS_COLLECTION_NAME,
  PILOTS_COLLECTION_NAME,
} from "@/constants/firestore";

export class PilotRepository {
  db: firestore.Firestore;
  collectionName: string;
  organisationCollectionName: string;

  constructor() {
    this.db = firestore();
    this.collectionName = PILOTS_COLLECTION_NAME;
    this.organisationCollectionName = ORGANISATIONS_COLLECTION_NAME;
  }

  list(organisationId: string) {
    return this.db
      .collection(this.organisationCollectionName)
      .doc(organisationId)
      .collection(this.collectionName)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PilotType))
      );
  }

  create(newPilot: PilotCreateType, organisationId: string) {
    return this.db
      .collection(this.organisationCollectionName)
      .doc(organisationId)
      .collection(this.collectionName)
      .add(newPilot)
      .then(
        (d) =>
          ({
            id: d.id,
            ...newPilot,
          } as PilotType)
      );
  }
}
