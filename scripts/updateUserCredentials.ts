import { initializeApp, credential, auth } from "firebase-admin";

initializeApp({
  credential: credential.cert("./dev-serviceaccount.json"),
});

const TECH_THUMBY_USER_ID = "cpisvu8ojQhDojQSIID6kBjGYq72";

// auth()
//   .getUser(TECH_THUMBY_USER_ID)
//   .then((res) => console.log(res));

auth()
  .setCustomUserClaims(TECH_THUMBY_USER_ID, {
    organisationIds: ["sClVivZhh3WIzgTjZMQv"],
    roles: ["FDTL_VIEWER"],
    admin: false,
  })
  .then((res) => console.log(res));

// auth()
//   .updateUser(TECH_THUMBY_USER_ID, { password: "12345678" })
//   .then(console.log);
