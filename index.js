// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const app = express()
// const port =process.env.PORT || 3000

// app.use(cors());
// app.use(express.json())

// const uri = "mongodb+srv://artify_db:W52DpwrCqs9k0UHO@cluster0.tx061fa.mongodb.net/?appName=Cluster0";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Artify server is runnig')
// })

// async function run() {
//   try {

//     await client.connect();

//     const db =client.db('artify_db')
//     const artifyCollection=db.collection('artifys')

//   //  app.get('/artifys',async(req,res)=>{
//   //   const result=await artifyCollection.find().sort({ createdAt: -1 }).limit(6).toArray();
     
//   //   res.send(result)
//   //  })
// //   app.get('/featured-artworks', async (req, res) => {
// //   const result = await artifyCollection.find().sort({ createdAt: -1 }).limit(6).toArray();
// //   res.send(result);
// // });

//    app.get('/artifys',async(req,res)=>{
//     const result =await artifyCollection.find().toArray();
//       res.send(result)
//    })

//   //  app.post('/artifys',async(req,res)=>{
//   //  const data= req.body
//   //  console.log(data)
//   //   const result =await artifyCollection.insertOne(data)
//   //   res.send({
//   //     sussces:true,
//   //     result
//   //   })
//   //   //  res.send(result);
//   //  })

//   app.post('/artifys', async (req, res) => {
//   try {
//     const data = req.body;
//     console.log('Received data:', data);

//     const result = await artifyCollection.insertOne(data);
//     console.log('Inserted Result:', result);

//     if(result.insertedId){
//       res.send({ success: true, insertedId: result.insertedId });
//     } else {
//       res.status(500).send({ success: false, message: "Insert failed" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, message: err.message });
//   }
// });



   
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {

  
//   }
// }
// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })



const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
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

    // GET all artworks
    app.get('/artifys', async (req, res) => {
      const result = await artifyCollection.find().toArray();
      res.send(result);
    });

    
app.post('/artifys', async (req, res) => {
  const data = req.body;
  const result = await artifyCollection.insertOne(data);
  res.send({ insertedId: result.insertedId });
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
