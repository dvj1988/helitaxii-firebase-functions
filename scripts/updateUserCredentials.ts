import { initializeApp, credential, auth } from "firebase-admin";

initializeApp({
  credential: credential.cert("./prod-serviceaccount.json"),
});

const TECH_THUMBY_USER_ID = "HYeWCvhViAW6t9h18pn7mVtZbBm1";

auth()
  .getUser(TECH_THUMBY_USER_ID)
  .then((res) => console.log(res));

// auth()
//   .setCustomUserClaims(TECH_THUMBY_USER_ID, {
//     organisationIds: ["700ImxH3FSTahzHX5YNE"],
//     roles: ["FDTL_ADMIN"],
//     admin: false,
//   })
//   .then((res) => console.log(res));
