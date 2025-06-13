require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3000;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

client.connect()
  .then(() => {
    console.log('🟢 Connected to MongoDB');
    const db = client.db('AnimalCharityDB');

    app.post('/donate', async (req, res) => {
      try {
        await db.collection('donations').insertOne(req.body);
        console.log('✅ Donation stored:', req.body);
        res.status(200).json({ message: 'Donation stored in database!' });
      } catch (err) {
        console.error('❌ Error storing donation:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    app.post('/contact', async (req, res) => {
      try {
        await db.collection('contacts').insertOne(req.body);
        console.log('✅ Contact message stored:', req.body);
        res.status(200).json({ message: 'Contact stored in database!' });
      } catch (err) {
        console.error('❌ Error storing contact:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    app.get('/test-insert', async (req, res) => {
      try {
        const result = await db.collection('donations').insertOne({
          name: 'Test User',
          email: 'test@example.com',
          amount: 123,
          timestamp: new Date()
        });
        console.log('✅ Test donation inserted:', result.insertedId);
        res.send('✅ Test donation inserted!');
      } catch (err) {
        console.error('❌ Test insert failed:', err);
        res.status(500).send('❌ Failed to insert donation');
      }
    });

    // ✅ New route: Get total donations
    app.get('/total-donations', async (req, res) => {
      try {
        const result = await db.collection('donations').aggregate([
          { $group: { _id: null, sum: { $sum: "$amount" } } }
        ]).toArray();
        const total = result[0]?.sum || 0;
        res.json({ total });
      } catch (err) {
        console.error('❌ Error getting total donations:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    app.listen(PORT, () => {
      console.log(`🌐 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 MongoDB connection failed:', err);
  });
