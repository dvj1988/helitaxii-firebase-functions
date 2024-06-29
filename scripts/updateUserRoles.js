const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("./src/config/dev.json"),
});

const TECH_THUMBY_USER_ID = "rlPCs1SjZWXHg85jUFqn15xO3LC3";

admin
  .auth()
  .getUser(TECH_THUMBY_USER_ID)
  .then((res) => console.log(res));

admin
  .auth()
  .setCustomUserClaims(TECH_THUMBY_USER_ID, {
    organisationIds: ["sClVivZhh3WIzgTjZMQv"],
    roles: ["FDTL_ADMIN", "DEVELOPER"],
    admin: true,
    agent: false,
  })
  .then((res) => console.log(res));
