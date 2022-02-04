import * as functions from "firebase-functions";
import pilotsApp from "./apps/pilots";
import machinesApp from "./apps/machines";
import organisationsApp from "./apps/organisations";
import { pilotFdtlOnWriteTrigger } from "./triggers/fdtl";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const firebaseHttps = functions
  .runWith({
    minInstances: 1,
    memory: "256MB",
  })
  .region("asia-south1").https.onRequest;

// Functions
export const pilots = firebaseHttps(pilotsApp);
export const machines = firebaseHttps(machinesApp);
export const organisations = firebaseHttps(organisationsApp);

// Triggers
export const onWritePilotFdtl = functions.firestore
  .document("organisations/{organisationId}/pilots/{pilotId}/fdtl/{fdtlId}")
  .onWrite(pilotFdtlOnWriteTrigger);
