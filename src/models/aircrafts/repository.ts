import { firestore } from "firebase-admin";
import { AircraftFirebaseType } from "@/types/aircraft";

const aircraftCollectionConverter = {
  toFirestore: (data: AircraftFirebaseType) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as AircraftFirebaseType,
};

export class AircraftRepository {
  client: firestore.Firestore;
  collectionName: string;

  constructor() {
    this.client = firestore();
    this.collectionName = "aircrafts";
  }

  list() {
    return firestore()
      .collection(this.collectionName)
      .withConverter(aircraftCollectionConverter)
      .get()
      .then((snapshot) =>
        snapshot.docs.map(({ id, data }) => ({ id, ...data() }))
      );
  }
}
