const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iftkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("framex");
    const usersCollection = database.collection("users");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");

    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const result = await usersCollection.findOne({ email, password });
      res.json(result);
    });

    app.post("/api/product", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.json(result);
    });

    app.get("/api/products", async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.json(products);
    });

    app.get("/api/products/:id", async (req, res) => {
      const product = await productsCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(product);
    });

    app.delete("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.deleteOne({ _id: ObjectId(id) });
    });

    app.post("/api/order", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    app.get("/api/orders", async (req, res) => {
      const orders = await ordersCollection.find().toArray();
      res.json(orders);
    });

    app.get("/api/order/:email", async (req, res) => {
      const email = req.params.email;
      const orders = await ordersCollection.find({ email }).toArray();
      res.json(orders);
    });

    app.delete("/api/order/:id", async (req, res) => {
      const id = req.params.id;
      const result = await ordersCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result);
    });

    app.put("/api/order/:id", async (req, res) => {
      const id = req.params.id;
      const result = await ordersCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { shipped: true } }
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
