const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  MongoRuntimeError,
} = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4sgk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toolCollection = client.db("scrap_tools_ltd").collection("tools");
    const purchaseCollection = client.db("scrap_tools_ltd").collection("purchases");

    app.get("/tool", async (req, res) => {
      const query = {};
      const cursor = toolCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });
    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolCollection.findOne(query);
      res.send(tool);
    });
    app.get("/purchase", async (req, res) => {
      const query = {};
      const cursor = purchaseCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });
    // app.delete("/purchase/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await purchaseCollection.deleteOne(query);
    //   res.send(result);
    // });
    app.get("/purchase", async (req, res) => {
      const customer = req.query.customer;
      const query = { customer: customer};
      const cursor = purchaseCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });

    app.post("/purchase", async (req, res) => {
      const purchase= req.body;
      const result = await purchaseCollection.insertOne(purchase);
      res.send(result);
    });

    app.put("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const updateStock = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: updateStock };
      const result = await toolCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from scrap server!!");
});

app.listen(port, () => {
  console.log(`scrap tools app listening on port ${port}`);
});
