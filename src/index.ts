import * as functions from "firebase-functions";
import fdtlApp from "./fdtl";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const fdtl = functions.https.onRequest(fdtlApp);
