import { firestore } from "firebase-admin";
import { PilotType } from "@/types/pilot";

export class PilotRepository {
  client: firestore.Firestore;
  collectionName: string;

  constructor() {
    this.client = firestore();
    this.collectionName = "pilots";
  }

  list() {
    return firestore()
      .collection(this.collectionName)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PilotType))
      );
  }
}
