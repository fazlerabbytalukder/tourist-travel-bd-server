const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnnr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log('database connect successfully');
        const database = client.db("touristTravel");
        const serviceCollection = database.collection("services");
        const bookingCollection = database.collection("bookings");
        const usersCollection = database.collection("users");

        //SERVICE DATA SHOW
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //BOOKING COLLECTION
        app.post('/bookings', async (req, res) => {
            //ei comment diye dekha databackend e aise kina
            // const appointment = req.body;
            // console.log(appointment);
            // res.json({message:'hello'})

            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            // console.log(result);
            res.json(result)
        })
        //GET BOOKING SPECIFIC USER DATA
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const date = req.query.date;
            // console.log(date);
            const query = { email: email, date: date }
            const cursor = bookingCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings);
        })
        //USER INFO POST TO THE DATABASE
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result)
        })
        //USER PUT FOR GOOGLE SIGN IN METHOD(upsert)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('i am from tourist travel server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})