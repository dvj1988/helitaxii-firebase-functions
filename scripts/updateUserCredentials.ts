import { initializeApp, credential, auth } from "firebase-admin";

initializeApp({
  credential: credential.cert("./dev-serviceaccount.json"),
});

const TECH_THUMBY_USER_ID = "rlPCs1SjZWXHg85jUFqn15xO3LC3";

// auth()
//   .getUser(TECH_THUMBY_USER_ID)
//   .then((res) => console.log(res));

auth()
  .setCustomUserClaims(TECH_THUMBY_USER_ID, {
    organisationIds: ["sClVivZhh3WIzgTjZMQv"],
    roles: ["DEVELOPER"],
    admin: true,
  })
  .then((res) => console.log(res));
