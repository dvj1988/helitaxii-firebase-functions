const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert("./src/config/prod.json"),
});

const db = admin.firestore();

async function fetchCollectionData(collectionRef, path) {
  const snapshot = await collectionRef.get();
  const data = {};
  console.log(`Fetching data from ${path}...`, performance.now());
  for (const doc of snapshot.docs) {
    const subCollections = await doc.ref.listCollections();
    data[doc.id] = doc.data();
    for (const subCollection of subCollections) {
      data[doc.id][subCollection.id] = await fetchCollectionData(
        subCollection,
        `${path}/${doc.id}/${subCollection.id}`
      );
    }
  }

  return data;
}

async function exportFirestoreData(collectionPath, outputFilename) {
  const collectionRef = db.collection(collectionPath);
  const data = await fetchCollectionData(collectionRef, collectionPath);

  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2), "utf8");
  console.log(`Data exported to ${outputFilename} successfully.`);
}

// Replace 'your-collection-path' with your Firestore collection path
// and 'output.json' with your desired output file name
exportFirestoreData("organisations", "export-prod.json");
