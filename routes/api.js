import express from "express";
import admin from "firebase-admin";
import db from "../confiq.js";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

// Create a new document
/** 🟢 Create a new poll */
router.post("/polls/create", async (req, res) => {
  console.log(req.body,'----------')
  try {
    const { question, options, pollType, expiresIn, hideResults } = req.body;
    // Generate a unique poll ID
    const pollId = uuidv4();
    
    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresIn); // e.g., expiresIn = 12 for 12 hours

    const pollData = {
      id: pollId,
      question,
      options: options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {}), // { option1: 0, option2: 0 }
      pollType, // "multiple-choice" or "yes/no"
      expiresAt: expiresAt.toISOString(),
      hideResults,
      reactions: { "🔥": 0, "👍": 0 },
      createdAt: new Date().toISOString(),
    };

    await db.collection("polls").doc(pollId).set(pollData);

    res.status(201).json({ id: pollId, message: "Poll created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/** 🟢 Vote on a poll */
router.post("/:pollId", async (req, res) => {
  try {
    const { pollId } = req.params;
    const { vote } = req.body;
console.log(pollId,vote,"=================")
    const pollRef = db.collection("polls").doc(pollId);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Increment vote count
    await pollRef.update({
      [`options.${vote}`]: admin.firestore.FieldValue.increment(1),
    });

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** 🟢 Get poll results (if allowed) */
router.get("/:pollId/results", async (req, res) => {
  try {
    const { pollId } = req.params;

    const pollRef = db.collection("polls").doc(pollId);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const pollData = pollDoc.data();
    
    // Check if results should be hidden
    const now = new Date().toISOString();
    if (pollData.hideResults && now < pollData.expiresAt) {
      return res.status(403).json({ error: "Results are hidden until poll expires" });
    }

    res.status(200).json({ results: pollData.options });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** 🟢 Add a reaction (🔥, 👍) */
router.post("/:pollId/reactions", async (req, res) => {
  try {
    const { pollId } = req.params;
    const { reaction } = req.body;

    const pollRef = db.collection("polls").doc(pollId);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) {
      return res.status(404).json({ error: "Poll not found" });
    }

    await pollRef.update({
      [`reactions.${reaction}`]: admin.firestore.FieldValue.increment(1),
    });

    res.status(200).json({ message: "Reaction added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** 🟢 Delete expired polls (Cron Job can call this) */
router.delete("/cleanup", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const expiredPolls = await db
      .collection("polls")
      .where("expiresAt", "<", now)
      .get();

    expiredPolls.forEach(async (doc) => {
      await db.collection("polls").doc(doc.id).delete();
    });

    res.status(200).json({ message: `${expiredPolls.size} expired polls deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
