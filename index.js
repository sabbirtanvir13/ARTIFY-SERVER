
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://artify_db:W52DpwrCqs9k0UHO@cluster0.tx061fa.mongodb.net/artify_db?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db('artify_db');
    const artifyCollection = db.collection('artifys');
     

    app.get('/artifys', async (req, res) => {
      const result = await artifyCollection.find().toArray();
      res.send(result);
    });

  app.get('/artifys/:id', async (req, res) => {
  const id = req.params.id;
  const result = await artifyCollection.findOne({ _id: new ObjectId(id) });
  res.send({ success: true, result });
});


    
app.post('/artifys', async (req, res) => {
  const data = req.body;
  const result = await artifyCollection.insertOne(data);
  res.send({ insertedId: result.insertedId });
});


 app.get('/latest-artifys', async (req, res) => {
  const result = await artifyCollection
    .find()
    .sort({ created_at: -1 }) 
    .limit(6)
    .toArray();

  res.send(result);
  console.log(result);
});


    

    app.post('/artifys', async (req, res) => {
  const data = req.body;
  data.createdAt = new Date();
  const result = await artifyCollection.insertOne(data);
  const newArtwork = await artifyCollection.findOne({ _id: result.insertedId });
  res.send({ success: true, artwork: newArtwork });
});



app.get('/explore-artworks', async (req, res) => {
  const result = await artifyCollection
    .find({ visibility: "Public" })
    .toArray();

  res.send(result);
});


// ✅ Get artworks by user email
app.get("/my-artworks", async (req, res) => {
  const email = req.query.email;
  const result = await artifyCollection.find({ created_at: email }).toArray()
  res.send(result);
});


app.delete("/artifys/:id", async (req, res) => {
  const id = req.params.id;
  const result = await artifyCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// ✅ Update artwork
app.put("/artifys/:id", async (req, res) => {
  const id = req.params.id;
  const updated = req.body;
  const result = await artifyCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updated }
  );
  res.send(result);
});






    app.get('/', (req,res) => {
      res.send('Artify server is running');
    });

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
