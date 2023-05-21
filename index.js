const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // mongodb 
require("dotenv").config();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASS);




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.py1cfi4.mongodb.net/?retryWrites=true&w=majority`;

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

    
    const carsCollection = client.db('toysCar').collection('toysCategory')
    // const subCategoriesCollection = client.db('subToysCar').collection('subCategories');
    const toysCollection = client.db('toysDB').collection('sub-toys');




    // Creating index on two fields
    const indexKeys = { toyName: 1}
    // Field two with actual field names
    const indexOptions = { name: "toyName"}
    // const result = await toysCollection.createIndex(indexKeys, indexOptions)


  


    // Read the data
    app.get('/addToy', async (req, res) => {
      const cursor = toysCollection.find().limit(20)
      const result = await cursor.toArray()
      res.send(result)
    })

    // To insert a new data from the form to front-end.
    app.post('/addToy', async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await toysCollection.insertOne(newToy)
      res.send(result);
    })


    // To get a user data by email
    app.get('/userData/:email', async (req, res) => {
      console.log(req.params.email)
      const result = await toysCollection.find({sellerEmail: req.params.email}).toArray();
      res.send(result);
    })

      // Get My toys details
      app.get('/addToy/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await toysCollection.findOne(query)
        res.send(result)
      })




    app.get('/cars', async (req, res) => {
      const cursor = carsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      // return
      const cars = await carsCollection.find({}).toArray()
      const singleCar = cars.find(car => {
       return car.toys.find(item => item.id == id)
      })
      
      res.send(singleCar)
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



app.get('/', (req, res) => {
    res.send('Vroom Vroom Toys is running');
})

app.listen(port, () =>{
    console.log(`Vroom Vroom is running on ${port}`);
})