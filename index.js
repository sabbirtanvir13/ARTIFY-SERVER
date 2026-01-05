

// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const admin = require("firebase-admin");
// const app = express();
// const port = process.env.PORT || 3000;
// require('dotenv').config()
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// app.use(cors());
// app.use(express.json());

// // Firebase admin setup
// const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8');
// const serviceAccount = JSON.parse(decoded);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// // JWT middleware
// const verifyJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).send({ message: "Unauthorized" });

//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).send({ message: "Forbidden" });
//     req.user = decoded; // { email, role }
//     next();
//   });
// };

// // Admin check
// const adminMiddleware = (req, res, next) => {
//   if (req.user.role !== "admin") return res.status(403).send({ error: "Admin access only" });
//   next();
// };




// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tx061fa.mongodb.net/artify_db?retryWrites=true&w=majority`;


// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });





// async function run() {
//   try {
//     // Always at top

//     // await client.connect();
//     console.log(" Connected to MongoDB!");

//     const db = client.db("artify_db");
//     const artifyCollection = db.collection("artifys");
//     const favoritesCollection = db.collection('favorites');
//     const statsCollection = db.collection("stats");
//     const testimonialsCollection = db.collection("testimonials");
//     const blogCollection = db.collection("blogs");
//     const faqCollection = db.collection("faqs");
//     const newsletterCollection = db.collection("newsletter");
//     const usersCollection = db.collection("users");


//     // ===== REGISTER =====
//     app.post("/users/register", async (req, res) => {
//       try {
//         const { name, email, password, role } = req.body;
//         if (!name || !email || !password) return res.status(400).send({ error: "All fields required" });

//         const exists = await usersCollection.findOne({ email });
//         if (exists) return res.status(400).send({ error: "User already exists" });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = { name, email, password: hashedPassword, role: role || "user" };

//         const result = await usersCollection.insertOne(newUser);
//         res.send({ success: true, insertedId: result.insertedId });
//       } catch (err) {
//         console.error("Register error:", err);
//         res.status(500).send({ error: "Server error" });
//       }
//     });

//     // ===== LOGIN =====
//     app.post("/users/login", async (req, res) => {
//       try {
//         const { email, password } = req.body;
//         const user = await usersCollection.findOne({ email });
//         if (!user) return res.status(400).send({ error: "Invalid credentials" });

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) return res.status(400).send({ error: "Invalid credentials" });

//         const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
//         res.send({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
//       } catch (err) {
//         console.error("Login error:", err);
//         res.status(500).send({ error: "Server error" });
//       }
//     });

//     // ===== GET PROFILE =====
//     app.get("/users/profile", verifyJWT, async (req, res) => {
//       const user = await usersCollection.findOne({ email: req.user.email }, { projection: { password: 0 } });
//       if (!user) return res.status(404).send({ error: "User not found" });
//       res.send({ success: true, user });
//     });

//     // ===== UPDATE PROFILE =====
//     app.put("/users/profile", verifyJWT, async (req, res) => {
//       const { name, password } = req.body;
//       const updateData = {};
//       if (name) updateData.name = name;
//       if (password) updateData.password = await bcrypt.hash(password, 10);

//       await usersCollection.updateOne({ email: req.user.email }, { $set: updateData });
//       const updatedUser = await usersCollection.findOne({ email: req.user.email }, { projection: { password: 0 } });
//       res.send({ success: true, user: updatedUser });
//     });

//     app.post("/newsletter", async (req, res) => {
//       const { email } = req.body;
//       if (!email) return res.status(400).send({ error: "Email required" });

//       const exists = await newsletterCollection.findOne({ email });
//       if (exists) return res.send({ success: false, message: "Already subscribed" });

//       const result = await newsletterCollection.insertOne({ email });
//       res.send({ success: true, insertedId: result.insertedId });
//     });




//     app.get("/testimonials", async (req, res) => {
//       const data = await testimonialsCollection.find().toArray();
//       res.send(data);
//     });

//     app.post("/testimonials", async (req, res) => {
//       const { name, message } = req.body;
//       if (!name || !message) return res.status(400).send({ error: "Name & message required" });

//       const result = await testimonialsCollection.insertOne({ name, message });
//       res.send({ success: true, insertedId: result.insertedId });
//     });




//     app.get("/faqs", async (req, res) => {
//       const faqs = await faqCollection.find().toArray();
//       res.send(faqs);
//     });

//     app.post("/faqs", async (req, res) => {
//       const { question, answer } = req.body; // only required
//       if (!question || !answer) return res.status(400).send({ error: "Question & answer required" });

//       const result = await faqCollection.insertOne({ question, answer });
//       res.send({ success: true, insertedId: result.insertedId });
//     });


//     app.get("/artifys", async (req, res) => {
//       const result = await artifyCollection.find().toArray();
//       res.send(result);
//     });




//     app.get("/blogs", async (req, res) => {
//       const blogs = await blogCollection.find().toArray();
//       res.send(blogs);
//     });

//     app.post("/blogs", async (req, res) => {
//       const { title, description } = req.body; // only required
//       if (!title || !description) return res.status(400).send({ error: "Title & description required" });

//       const result = await blogCollection.insertOne({ title, description });
//       res.send({ success: true, insertedId: result.insertedId });
//     });


//     // User stats route
//     // app.get("/user-stats", verifyJWT, async (req, res) => {
//     //   try {
//     //     const user = req.user; // decoded JWT: { email, role }

//     //     // artworks created by this user
//     //     const artworks = await artifyCollection.countDocuments({ userEmail: user.email });

//     //     // favorites of this user
//     //     const favorites = await favoritesCollection.countDocuments({ email: user.email });

//     //     // total likes on user's artworks
//     //     const userArtworks = await artifyCollection.find({ userEmail: user.email }).toArray();
//     //     const likes = userArtworks.reduce((sum, art) => sum + (art.likes || 0), 0);

//     //     // recent 5 artworks
//     //     const recentArtworks = await artifyCollection
//     //       .find({ userEmail: user.email })
//     //       .sort({ createdAt: -1 })
//     //       .limit(5)
//     //       .toArray();

//     //     res.send({ artworks, favorites, likes, recentArtworks });
//     //   } catch (err) {
//     //     console.error(err);
//     //     res.status(500).send({ error: "Failed to fetch user stats" });
//     //   }
//     // });


//     // Update user role (Admin only)
//     // Example backend


//     // GET all users (admin only)
//     // GET all users (admin only)
//     app.get("/users", verifyJWT, adminMiddleware, async (req, res) => {
//       try {
//         const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
//         res.send(users);
//       } catch (err) {
//         res.status(500).send({ error: "Failed to fetch users" });
//       }
//     });

//     // Update user role (admin only)
//     app.put("/users/:email/role", verifyJWT, adminMiddleware, async (req, res) => {
//       const email = req.params.email;
//       const { role } = req.body;
//       if (!role) return res.status(400).send({ error: "Role required" });

//       try {
//         const result = await usersCollection.findOneAndUpdate(
//           { email },
//           { $set: { role } },
//           { returnDocument: "after", projection: { password: 0 } }
//         );

//         if (!result.value) return res.status(404).send({ error: "User not found" });

//         res.send({ success: true, user: result.value });
//       } catch (err) {
//         res.status(500).send({ error: "Failed to update role" });
//       }
//     });



//     // Refresh token with updated role
//     app.get("/users/refresh-token", verifyJWT, async (req, res) => {
//       try {
//         const user = await usersCollection.findOne(
//           { email: req.user.email },
//           { projection: { password: 0 } }
//         );
//         if (!user) return res.status(404).send({ error: "User not found" });

//         // Generate new JWT with updated role
//         const token = jwt.sign(
//           { email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "7d" }
//         );

//         res.send({ success: true, token, user });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: "Failed to refresh token" });
//       }
//     });



//     app.post("/stats", verifyJWT, adminMiddleware, async (req, res) => {
//       const { label, value } = req.body;
//       if (!label || !value) return res.status(400).send({ error: "Label & value required" });

//       const result = await statsCollection.insertOne({ label, value });
//       res.send({ success: true, insertedId: result.insertedId });
//     });


//     //  Get platform stats
//     // app.get("/stats", async (req, res) => {
//     //   const stats = await statsCollection.find().toArray();
//     //   res.send(stats);
//     // });


//     app.get("/stats", async (req, res) => {
//       try {
//         const users = await usersCollection.countDocuments();
//         const artworks = await artifyCollection.countDocuments();
//         const favorites = await favoritesCollection.countDocuments();
//         const blogs = await blogCollection.countDocuments();

//         res.send([
//           { label: "Users", value: users },
//           { label: "Artworks", value: artworks },
//           { label: "Favorites", value: favorites },
//           { label: "Blogs", value: blogs },
//         ]);
//       } catch (err) {
//         res.status(500).send({ error: "Failed to load stats" });
//       }
//     });



//     app.get("/artifys/:id", async (req, res) => {
//       const id = req.params.id;
//       const result = await artifyCollection.findOne({ _id: new ObjectId(id) });
//       res.send({ success: true, result });
//     });


//     // app.post("/artifys", async (req, res) => {
//     //   const data = req.body;
//     //   data.createdAt = new Date();
//     //   const result = await artifyCollection.insertOne(data);
//     //   res.send({ success: true, insertedId: result.insertedId });
//     // });
//     app.post("/artifys", verifyJWT, async (req, res) => {
//       const data = req.body;
//       data.createdAt = new Date();
//       data.userEmail = req.user.email;
//       const result = await artifyCollection.insertOne(data);
//       res.send({ success: true, insertedId: result.insertedId });
//     });


//     app.get("/latest-artifys", async (req, res) => {
//       const result = await artifyCollection
//         .find()
//         .sort({ createdAt: -1 })
//         .limit(8)
//         .toArray();
//       res.send(result);
//     });


//     app.get("/explore-artworks", async (req, res) => {
//       const result = await artifyCollection
//         .find({ visibility: "Public" })
//         .toArray();
//       res.send(result);
//     });


//     app.get("/my-artworks", async (req, res) => {
//       const email = req.query.email;
//       if (!email) return res.status(400).send({ error: "Missing email" });
//       const result = await artifyCollection.find({ userEmail: email }).toArray();
//       res.send(result);
//     });


//     app.delete("/artifys/:id", async (req, res) => {
//       const id = req.params.id;
//       const result = await artifyCollection.deleteOne({ _id: new ObjectId(id) });
//       res.send(result);
//     });


//     app.put("/artifys/:id", async (req, res) => {
//       const id = req.params.id;
//       const updated = req.body;
//       const result = await artifyCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: updated }
//       );
//       res.send(result);
//     });



//     app.post("/artifys/:id/like", async (req, res) => {
//       const id = req.params.id;
//       const { email } = req.body;

//       if (!email) return res.status(400).send({ error: "Missing user email" });

//       const result = await artifyCollection.updateOne(
//         { _id: new ObjectId(id), likedBy: { $ne: email } },
//         { $inc: { likes: 1 }, $push: { likedBy: email } }
//       );
//       const updatedArtwork = await artifyCollection.findOne({ _id: new ObjectId(id) });
//       res.send({ success: true, artwork: updatedArtwork });
//     });


//     app.post("/favorites", async (req, res) => {
//       const { email, artworkId, title, image, artistName } = req.body;

//       const exists = await favoritesCollection.findOne({ email, artworkId });
//       if (exists) return res.send({ success: false });

//       const result = await favoritesCollection.insertOne({
//         email,
//         artworkId,
//         title,
//         image,
//         artistName,
//         createdAt: new Date(),
//       });

//       res.send({ success: true, result });
//     });

//     app.get("/favorites", async (req, res) => {
//       const favorites = await favoritesCollection.find({ email: req.query.email }).toArray();
//       res.send(favorites);
//     });

//     app.delete("/favorites/:id", async (req, res) => {
//       const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//       res.send({ success: true, result });
//     });






//     app.get("/", (req, res) => {
//       res.send(" Artify server is running!");
//     });

//   } catch (err) {
//     console.error("Error in run():", err);
//   }
// }

// run().catch(console.dir);


// app.listen(port, () => {
//   console.log(` Server running on port ${port}`);
// });





require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3000;

// app.use(cors({ origin: process.env.CLIENT_DOMAIN, credentials: true }));
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))


app.use(express.json());

// ===== Firebase Admin Setup =====
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1]
  console.log(token)
  if (!token) return res.status(401).send({ message: 'Unauthorized Access!' })
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    console.log(decoded)
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).send({ message: 'Unauthorized Access!', err })
  }
}



// ===== MongoDB Setup =====
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tx061fa.mongodb.net/artify_db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1 } });





// ===== Run Server =====
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("artify_db");
    const usersCollection = db.collection("users");
    const artifyCollection = db.collection("artifys");
    const favoritesCollection = db.collection('favorites');
    const statsCollection = db.collection("stats");
    const testimonialsCollection = db.collection("testimonials");
    const blogCollection = db.collection("blogs");
    const faqCollection = db.collection("faqs");
    const newsletterCollection = db.collection("newsletter");



    // ✅ verifyADMIN এখানে আনো
    const verifyADMIN = async (req, res, next) => {
      const email = req.tokenEmail
      const user = await usersCollection.findOne({ email })

      if (user?.role !== 'admin') {
        return res.status(403).send({
          message: 'Admin only Actions!',
          role: User?.role
        })
      }
      next()
    }



    // save or update a user in db
    app.post('/user', async (req, res) => {
      const userData = req.body
      userData.created_at = new Date().toISOString()
      userData.last_loggedIn = new Date().toISOString()
      userData.role = 'user'

      const query = {
        email: userData.email,
      }

      const alreadyExists = await usersCollection.findOne(query)
      console.log('User Already Exists---> ', !!alreadyExists)

      if (alreadyExists) {
        console.log('Updating user info......')
        const result = await usersCollection.updateOne(query, {
          $set: {
            last_loggedIn: new Date().toISOString(),
          },
        })
        return res.send(result)
      }

      console.log('Saving new user info......')
      const result = await usersCollection.insertOne(userData)
      res.send(result)
    })

    // get a user's role
    app.get('/user/role', verifyJWT, async (req, res) => {
      const user = await usersCollection.findOne({ email: req.tokenEmail })

      if (!user) {
        return res.status(404).send({ role: 'user' })
      }

      res.send({ role: user.role || 'user' })
    })




    app.post("/stats", verifyJWT, verifyADMIN, async (req, res) => {
      const { label, value } = req.body;
      if (!label || !value) return res.status(400).send({ error: "Label & value required" });

      const result = await statsCollection.insertOne({ label, value });
      res.send({ success: true, insertedId: result.insertedId });
    });


    //  Get platform stats
    // app.get("/stats", async (req, res) => {
    //   const stats = await statsCollection.find().toArray();
    //   res.send(stats);
    // });


    app.get("/stats", async (req, res) => {
      try {
        const users = await usersCollection.countDocuments();
        const artworks = await artifyCollection.countDocuments();
        const favorites = await favoritesCollection.countDocuments();
        const blogs = await blogCollection.countDocuments();

        res.send([
          { label: "Users", value: users },
          { label: "Artworks", value: artworks },
          { label: "Favorites", value: favorites },
          { label: "Blogs", value: blogs },
        ]);
      } catch (err) {
        res.status(500).send({ error: "Failed to load stats" });
      }
    });







    // get all users for admin
    app.get('/users', verifyJWT, verifyADMIN, async (req, res) => {
      const adminEmail = req.tokenEmail
      const result = await usersCollection
        .find({ email: { $ne: adminEmail } })
        .toArray()
      res.send(result)
    })






    // ===== Artworks =====
    app.get("/artifys", async (req, res) => {
      const result = await artifyCollection.find().toArray();
      res.send(result);
    });

    app.get("/artifys/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artifyCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });



    app.post("/artifys", verifyJWT, async (req, res) => {
      const data = req.body
      data.userEmail = req.tokenEmail
      data.createdAt = new Date()
      const result = await artifyCollection.insertOne(data)
      res.send(result)
    })


    app.put("/artifys/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await artifyCollection.updateOne({ _id: new ObjectId(id) }, { $set: updated });
      res.send(result);
    });

    app.delete("/artifys/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artifyCollection.deleteOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });

    // ===== Favorites =====
    app.post("/favorites", async (req, res) => {
      const { artworkId, title, image } = req.body;
      const exists = await favoritesCollection.findOne({ email: req.userEmail, artworkId });
      if (exists) return res.send({ success: false, message: "Already favorited" });

      const result = await favoritesCollection.insertOne({
        email: req.userEmail,
        artworkId,
        title,
        image,
        createdAt: new Date()
      });
      res.send({ success: true, result });
    });

    app.get("/favorites", async (req, res) => {
      const favorites = await favoritesCollection.find({ email: req.userEmail }).toArray();
      res.send(favorites);
    });

    app.delete("/favorites/:id", async (req, res) => {
      const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send({ success: true, result });
    });



    app.patch("/users/update-role", async (req, res) => {
      const { email, role } = req.body;
      if (!email || !role) return res.status(400).send({ message: "Email & role required" });
      const result = await usersCollection.updateOne({ email }, { $set: { role } });
      res.send({ success: true, modifiedCount: result.modifiedCount });
    });

    // ===== Testimonials, FAQs, Blogs, Newsletter =====
    app.get("/testimonials", async (req, res) => res.send(await testimonialsCollection.find().toArray()));
    app.post("/testimonials", async (req, res) => {
      const { name, message } = req.body;
      const result = await testimonialsCollection.insertOne({ name, message });
      res.send({ success: true, insertedId: result.insertedId });
    });

    app.get("/faqs", async (req, res) => res.send(await faqCollection.find().toArray()));
    app.post("/faqs", async (req, res) => {
      const { question, answer } = req.body;
      const result = await faqCollection.insertOne({ question, answer });
      res.send({ success: true, insertedId: result.insertedId });
    });



    app.post("/artifys/:id/like", async (req, res) => {
      const id = req.params.id;
      const { email } = req.body;

      if (!email) return res.status(400).send({ error: "Missing user email" });

      const result = await artifyCollection.updateOne(
        { _id: new ObjectId(id), likedBy: { $ne: email } },
        { $inc: { likes: 1 }, $push: { likedBy: email } }
      );
      const updatedArtwork = await artifyCollection.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, artwork: updatedArtwork });
    });


    app.get("/my-likes", verifyJWT, async (req, res) => {
      const email = req.tokenEmail;

      const likedArtworks = await artifyCollection
        .find({ likedBy: email })
        .toArray();

      res.send(likedArtworks);
    });


  




    app.get("/blogs", async (req, res) => res.send(await blogCollection.find().toArray()));
    app.post("/blogs", async (req, res) => {
      const { title, description } = req.body;
      const result = await blogCollection.insertOne({ title, description });
      res.send({ success: true, insertedId: result.insertedId });
    });

    app.post("/newsletter", async (req, res) => {
      const { email } = req.body;
      const exists = await newsletterCollection.findOne({ email });
      if (exists) return res.send({ success: false, message: "Already subscribed" });
      const result = await newsletterCollection.insertOne({ email });
      res.send({ success: true, insertedId: result.insertedId });
    });

    app.get("/", (req, res) => res.send("Artify Firebase server running!"));

  } catch (err) {
    console.error("Error in run():", err);
  }
}

run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));
