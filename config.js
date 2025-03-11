
// export default db;
import admin from "firebase-admin";
import { readFile } from "fs/promises";

// Load service account key dynamically
const serviceAccount = JSON.parse(
  await readFile(new URL("./serviceAccountKey.json", import.meta.url))
);

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Example: Read from Firestore
async function testFirestore() {
  try {
    const snapshot = await db.collection("test").get();
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Error reading Firestore:", error);
  }
}

testFirestore();

export default db;