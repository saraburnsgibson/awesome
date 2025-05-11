import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "secrets", "serviceAccountKey.json"))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/save-game", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  try {
    console.log("Incoming save-game request");

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log("Authenticated UID:", uid);

    const { grid, score, skillLevel, timestamp, achievements } = req.body;

    await db.collection("games").add({ uid, grid, score, skillLevel, achievements, timestamp });
    console.log("Game saved");

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    console.log("User document exists?", userDoc.exists);

    const existing = userDoc.exists && Array.isArray(userDoc.data().achievements)
      ? userDoc.data().achievements
      : [];

    const mergedAchievements = Array.from(new Set([...existing, ...achievements]));
    console.log("Merged achievements:", mergedAchievements);

    await userRef.set({ uid, achievements: mergedAchievements }, { merge: true });
    console.log("User profile written to /users:", uid);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error in /save-game:", error);
    res.status(500).send({ error: "Save failed" });
  }
});

const PORT = process.env.VITE_BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
