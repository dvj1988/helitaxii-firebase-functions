import { initializeApp, credential, auth } from "firebase-admin";

initializeApp({
  credential: credential.cert("./dev-serviceaccount.json"),
});

const TECH_THUMBY_USER_ID = "rlPCs1SjZWXHg85jUFqn15xO3LC3";

auth().updateUser(TECH_THUMBY_USER_ID, { password: "" }).then(console.log);
