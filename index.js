

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = "mongodb+srv://artify_db:W52DpwrCqs9k0UHO@cluster0.tx061fa.mongodb.net/artify_db?retryWrites=true&w=majority";

// Mongo client setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Run the main async function
async function run() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB!");

    const db = client.db("artify_db");
    const artifyCollection = db.collection("artifys");

    //  Get all artworks
    app.get("/artifys", async (req, res) => {
      const result = await artifyCollection.find().toArray();
      res.send(result);
    });

    // Get single artwork by ID
    app.get("/artifys/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artifyCollection.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });

    //  Add new artwork
    app.post("/artifys", async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();
      const result = await artifyCollection.insertOne(data);
      res.send({ success: true, insertedId: result.insertedId });
    });

    //  Get latest artworks
    app.get("/latest-artifys", async (req, res) => {
      const result = await artifyCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    //  Explore (public only)
    app.get("/explore-artworks", async (req, res) => {
      const result = await artifyCollection
        .find({ visibility: "Public" })
        .toArray();
      res.send(result);
    });

    //  My artworks by email
    app.get("/my-artworks", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ error: "Missing email" });
      const result = await artifyCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    //  Delete artwork
    app.delete("/artifys/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artifyCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //  Update artwork
    app.put("/artifys/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await artifyCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

    //  Root route
    app.get("/", (req, res) => {
      res.send(" Artify server is running!");
    });

  } catch (err) {
    console.error("Error in run():", err);
  }
}

run().catch(console.dir);

//  Start server
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
