const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get('/categoryToys/:category', async(req, res)=>{
      const search = req.params.category;
      console.log(search);
      if(search == 1 || search == 2 || search == 2 || search == "mini fire truck" || search == "police car"  ){
        const result = await toysCollection.find({category: search}).toArray();
  
       return res.send(result);
      }
      // const result = await toysCollection.find({}).toArray();
      //   res.send(result);
    })

    app.delete('/myToys/:id', async(req, res)=>{
      const id = req.params.id;
      const query={_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })
  


    app.get('/allToys/:id', async(req, res)=>{
      const id = req.params.id;
      const query={_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query);
      console.log(result);
      res.send(result);
    })

    app.put('/allToys/:id', async(req, res)=>{
      const id = req.params.id;
      const filter={_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateToys=req.body;
      const updateToy={
        $set:{
          quantity: updateToys.quantity,
           price: updateToys.price,
           description: updateToys.description

        }
        
      }
      const result = await toysCollection.updateOne(filter, updateToy, options);
      console.log(result);
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