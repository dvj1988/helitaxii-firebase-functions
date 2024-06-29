const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("./src/config/dev.json"),
});

const TECH_THUMBY_USER_ID = "rlPCs1SjZWXHg85jUFqn15xO3LC3";

admin
  .auth()
  .updateUser(TECH_THUMBY_USER_ID, { password: "tech@thumbyaviation.com" })
  .then(console.log);
