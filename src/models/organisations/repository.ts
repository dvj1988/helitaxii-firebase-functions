import { firestore } from "firebase-admin";
import { OrganisationCreateType, OrganisationType } from "@/types/organisation";
import { ORGANISATIONS_COLLECTION_NAME } from "@/constants/firestore";

export class OrganisationRepository {
  db: firestore.Firestore;
  collectionName: string;

  constructor() {
    this.db = firestore();
    this.collectionName = ORGANISATIONS_COLLECTION_NAME;
  }

  list() {
    return this.db
      .collection(this.collectionName)
      .get()
      .then((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as OrganisationType)
        )
      );
  }

  create(newOrganisation: OrganisationCreateType) {
    return this.db
      .collection(this.collectionName)
      .add(newOrganisation)
      .then(
        (d) =>
          ({
            id: d.id,
            ...newOrganisation,
          } as OrganisationType)
      );
  }
}
