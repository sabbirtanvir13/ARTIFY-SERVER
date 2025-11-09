const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port =process.env.PORT || 3000

app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://artify_db:W52DpwrCqs9k0UHO@cluster0.tx061fa.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Artify server is runnig')
})

async function run() {
  try {

    await client.connect();

    const db =client.db('artify_db')
    const artifyCollection=db.collection('artifys')

   app.get('/artifys',async(req,res)=>{
    const result=await artifyCollection.find().sort({ createdAt: -1 }).limit(6).toArray();
      // const result=await artifyCollection.find().toArray()
    res.send(result)
   })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
