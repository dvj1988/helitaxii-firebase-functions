import * as functions from "firebase-functions";
import { PilotFirebaseType } from "@/types/pilot";
import { isUndefined } from "lodash";
import {
  ORGANISATIONS_COLLECTION_NAME,
  AGGREGATES_COLLECTION_NAME,
} from "@/constants/firestore";
import { CollectionStatsDocType } from "@/types/common";

export const collectionOnWriteTrigger: (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => any = async (change, context) => {
  const newData = change.after.data() as PilotFirebaseType;
  const previousData = change.before.data() as PilotFirebaseType;
  const { organisationId, collectionName } = context.params;

  if (collectionName === AGGREGATES_COLLECTION_NAME) {
    return null;
  }

  const isDeletion = isUndefined(newData) || newData.deletedAt;
  const isCreation = isUndefined(previousData);

  const operation = isDeletion ? "DELETE" : isCreation ? "CREATE" : "UPDATE";

  console.log(collectionName, operation);

  const db = change.after.ref.firestore;

  if (operation === "UPDATE") {
    return null;
  }

  return db.runTransaction(async (transaction) => {
    const statsDoc = await transaction.get(
      db
        .collection(ORGANISATIONS_COLLECTION_NAME)
        .doc(organisationId)
        .collection(AGGREGATES_COLLECTION_NAME)
        .doc(collectionName)
    );

    if (statsDoc.exists) {
      const stats = statsDoc.data() as CollectionStatsDocType;

      console.log(stats);

      const newTotalCount =
        operation === "CREATE"
          ? stats.totalCount + 1
          : stats.totalCount > 0
          ? stats.totalCount - 1
          : 0;

      return transaction.update(statsDoc.ref, {
        totalCount: newTotalCount,
      });
    }

    const newTotalCount = operation === "CREATE" ? 1 : 0;

    return transaction.create(statsDoc.ref, {
      totalCount: newTotalCount,
    });
  });
};
