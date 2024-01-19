const express = require('express');
const path = require('path'); // Add this line to use the path module
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');
require('dotenv').config();


const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

const mongoUri = process.env.DATABASE_URL;
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/adminpanelsovabezdostupa', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adminpanel.html'));
});


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

app.post('/submit-booking', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("second");

    const { date, timeSlots, name, phone } = req.body;

    let updateObj = {};
    for (const [key, value] of Object.entries(timeSlots)) {
      updateObj[`timeSlots.${key}`] = { service: value, name: name, phone: phone }; // Store service, name, and phone number
    }

    const result = await collection.updateOne(
      { date: date },
      { $set: updateObj },
      { upsert: true } // Change to true if you want to create a new document when one doesn't exist
    );

    res.status(200).json({ message: 'Booking updated', result: result });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking', error: error });
  } finally {
    await client.close();
  }
});







app.get('/get-bookings-for-date', async (req, res) => {
  const selectedDate = req.query.date; // "14.01.2024" for example
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("second");
    const query = { date: selectedDate };
    const bookingForDate = await collection.findOne(query);

    // If no booking document is found for the selected date, create an empty object
    const timeSlots = bookingForDate ? bookingForDate.timeSlots : {};
    res.status(200).json(timeSlots);
  } catch (error) {
    console.error('Error fetching bookings for the date:', error);
    res.status(500).send('Error fetching bookings for the date');
  } finally {
    await client.close();
  }
});

app.get('/get-all-bookings', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("second");
    const allBookings = await collection.find({}).toArray(); // Fetch all documents
    res.status(200).json(allBookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).send('Error fetching all bookings');
  } finally {
    await client.close();
  }
});

app.get('/get-all-submited-bookings', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("first");
    const allBookings = await collection.find({}).toArray(); // Fetch all documents
    res.status(200).json(allBookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).send('Error fetching all bookings');
  } finally {
    await client.close();
  }
});


app.delete('/delete-booking/:bookingId', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("XPL");
    const collection = database.collection("first");
    
    const bookingId = req.params.bookingId;
    const result = await collection.deleteOne({ _id: new ObjectId(bookingId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking' });
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
