import * as functions from "firebase-functions";
import pilotsApp from "./apps/pilots";
import aircraftsApp from "./apps/aircrafts";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const firebaseHttps = functions
  .runWith({
    minInstances: 1,
    memory: "256MB",
  })
  .region("asia-south1").https.onRequest;

export const pilots = firebaseHttps(pilotsApp);
export const aircrafts = firebaseHttps(aircraftsApp);
