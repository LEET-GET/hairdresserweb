const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://butenkoprosha:UANiyPQSBPzj7o5T@xpltoatisu.8xm3ppb.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function deleteAllDocuments() {
  try {
    let isConnected = false;
    while (!isConnected) {
      try {
        await client.connect();
        isConnected = true; // Set to true if the connection is successful
        console.log('Connected to the database in drop.js!');
      } catch (error) {
        console.error('Error connecting to the database:', error.message);
        console.log('Retrying in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      }
    }

    const database = client.db("XPL");
    const collection = database.collection("first");

    // Delete all documents in the collection
    const result = await collection.deleteMany({});

    console.log(`${result.deletedCount} documents deleted.`);
  } finally {
    await client.close();
  }
}

deleteAllDocuments();

