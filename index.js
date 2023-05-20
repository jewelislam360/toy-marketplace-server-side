const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app=express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nn2sj3o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const toysCollection = client.db('toysCar').collection('toys');

    app.post('/addToy', async(req, res)=>{
        const body = req.body;
        const result = await toysCollection.insertOne(body);
        console.log(body);
        res.send(result);
    })

    app.get('/allToys', async(req, res)=>{
        const result =await toysCollection.find({}).toArray();
        res.send(result);
    })

    app.get('/myToys/:email', async(req, res)=>{
      const email = req.params.email;
      const result = await toysCollection.find({email: email}).toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Toys car server is running ')

})

app.listen(port, ()=>{
    console.log(`Toys car server is running on port: ${port}`);
})