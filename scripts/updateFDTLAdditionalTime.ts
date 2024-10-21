import admin from "firebase-admin";
import moment from "moment";
import { calculateFlightTimesFromDuties } from "../src/utils/fdtl";
import fdtlThresholdStore from "../src/utils/fdtlThresholdStore";
import fs from "fs";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert("./src/config/prod.json"),
});

const db = admin.firestore();

const migrate = async () => {
  const logs: any[] = [];

  const organisationId = "700ImxH3FSTahzHX5YNE";

  const organisationRef = db.collection("organisations").doc(organisationId);

  const subCollectionRef = organisationRef.collection("pilots");

  const subCollectionSnapshot = await subCollectionRef.get();

  for (const pilotDoc of subCollectionSnapshot.docs) {
    const fdtlSubCollectionRef = pilotDoc.ref.collection("fdtl");

    const fdtlSubCollectionSnapshot = await fdtlSubCollectionRef.get();

    for (const fdtlDoc of fdtlSubCollectionSnapshot.docs) {
      const fdtlDocumentId = fdtlDoc.id;

      const momentDate = moment(fdtlDocumentId, "DD-MM-YYYY").utcOffset(
        "+05:30"
      );

      const data = fdtlDoc.data();

      const aggregate = calculateFlightTimesFromDuties({
        duties: data.duty,
        date: momentDate.toDate(),
      });

      const fdtlAdditionalTime = fdtlThresholdStore.getValueForDate(
        momentDate.toDate()
      );

      if (
        aggregate.flightDutyInMins.onDay !==
        data.aggregate.flightDutyInMins.onDay
      ) {
        logs.push({
          pilotId: pilotDoc.id,
          date: momentDate.format("DD/MM/YYYY"),
          previous: data.aggregate.flightDutyInMins.onDay,
          current: aggregate.flightDutyInMins.onDay,
          fdtlAdditionalTime,
        });

        console.log(
          "NOT EQUAL",
          pilotDoc.id,
          fdtlDocumentId,
          momentDate.format("DD/MM/YYYY"),
          aggregate.flightDutyInMins.onDay,
          data.aggregate.flightDutyInMins.onDay
        );
      }

      // Update the new aggregate values
      await fdtlDoc.ref.update({
        aggregate,
        fdtlAdditionalTime,
      });
    }
  }

  fs.writeFileSync(
    "./fdtl-migration-logs-prod.json",
    JSON.stringify(logs, null, 2)
  );
};

migrate();
