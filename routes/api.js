import express from 'express';
import admin from 'firebase-admin';
import db from '../config.js'; // Ensure the .js extension is included for local imports
const router = express.Router();

// Create a new document
router.post('/create', async (req, res) => {
  try {
    const data = req.body;
    console.log(data, '----------------------');
    // const docRef = await db
    //   .collection('items1')
    //   .add({ name: 'masdus', age: 24 })
    // const docRef = await addDoc(collection(db, 'items'), {
    //   name: 'Example Item',
    //   description: 'This is an example description',
    //   price: 100,
    // });
    const datas = {
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    };
    const res = await db.collection('cities').doc('LA').set(datas);
    res
      .status(201)
      .json({ id: docRef.id, message: 'Document created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all documents
router.get('/read', async (req, res) => {
  try {
    const snapshot = await db.collection('items').get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

export default router;
