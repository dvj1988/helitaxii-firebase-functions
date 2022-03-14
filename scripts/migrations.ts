import { initializeApp, credential, firestore } from "firebase-admin";

initializeApp({
  credential: credential.cert("./dev-serviceaccount.json"),
});

const db = firestore();

db.runTransaction(async (transaction) => {
  const pilotIds: string[] = [
    "HiY8DIvcoWrOq8e5tbhN",
    "JyYCfCWlFszdcVxKAkvw",
    "K8dVXm2evBs6TWvu4y5j",
    "QKNhvwU02MqvDWY2nLE5",
    "QdSl64V5Lb7mM1019dpm",
    "Sbzc3lAp6Gh79b0ArDto",
    "TTvXHsfEskzkzTyFF4nx",
    "bSjpodKBincsFIRxmJ9I",
    "g6aEQCOpMRQ56kVqylfI",
    "i07P2IAG9EQDmolKdq3G",
    "nk1KjOdONnT0iQnB8v3M",
    "oYMakVElx6M4BETqUoph",
    "uyUVRcSX3fkKhKSzdvhD",
    "xlPZigJthu2ujDeuHo41",
  ];
  //   const fdtls: any[] = [];

  const pilotCollections = db
    .collection("organisations")
    .doc("sClVivZhh3WIzgTjZMQv")
    .collection("pilots");

  for (let i = 0; i < pilotIds.length; i++) {
    const fdtlSnaphot = await pilotCollections
      .doc(pilotIds[i])
      .collection("fdtl")
      .get();

    fdtlSnaphot.docs.map((doc) => {
      console.log(doc.data());
      const prevData = doc.data();
      const docRef = doc.ref;

      const newFdtlData = {
        aggregate: {
          ...prevData.aggregate,
        },
        date: prevData.date,
        duty: prevData.duty.map((duty: any) => {
          return {
            ...duty,
            machineId: prevData.machineId,
          };
        }),
      };

      transaction.update(docRef, newFdtlData);
    });
  }
});
