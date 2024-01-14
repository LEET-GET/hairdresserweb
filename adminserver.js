const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUri = "mongodb+srv://butenkoprosha:UANiyPQSBPzj7o5T@xpltoatisu.8xm3ppb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(mongoUri);

app.post('/submit-data', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("first");
    const result = await collection.insertOne(req.body);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error connecting to the database');
  } finally {
    await client.close();
  }
});

app.get('/get-bookings', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("first");
    const bookings = await collection.find({ Verified: { $exists: false } }).toArray();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  } finally {
    await client.close();
  }
});

app.post('/accept-booking', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("first");
    await collection.updateOne({ _id: req.body.id }, { $set: { Verified: "yes" } });
    res.status(200).json({ message: 'Booking accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting booking' });
  } finally {
    await client.close();
  }
});

app.post('/reject-booking', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("first");
    await collection.deleteOne({ _id: req.body.id });
    res.status(200).json({ message: 'Booking rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting booking' });
  } finally {
    await client.close();
  }
});

app.post('/edit-booking', async (req, res) => {
  // Add logic for editing a booking
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
