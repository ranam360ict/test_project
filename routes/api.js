const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Get Firestore database instance
const db = admin.firestore();

// Create a new document
router.post('/create', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('items').add(data);
    res
      .status(201)
      .json({ id: docRef.id, message: 'Document created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all documents
router.get('/read', async (req, res) => {
  res.send({ sdfa: 99 });
  // try {
  //   const snapshot = await db.collection('items').get();
  //   const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //   res.status(200).json(items);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
});

// Update a document
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection('items').doc(id).update(data);
    res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('items').doc(id).delete();
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
