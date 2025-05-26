// api/index.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@sajjadjim15.ac97xgz.mongodb.net/?retryWrites=true&w=majority&appName=SajjadJim15`;

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
        const usersCollection = client.db('ClientDB').collection('users');
        const tasksCollection = client.db('TaskDB').collection('tasks');
        const reviewsCollection = client.db('ReviewsDB').collection('reviews');

        // Define your routes
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        // Tasks Routes
        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await tasksCollection.insertOne(newTask);
            res.send(result);
        });

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result);
        });

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filterData = { _id: new ObjectId(id) };
            const updatedTask = req.body;
            const updatedDoc = { $set: updatedTask };
            const result = await tasksCollection.updateOne(filterData, updatedDoc);
            res.send(result);
        });

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        });

        // Reviews Routes
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        });

        app.get('/reviews/top', async (req, res) => {
            const result = await reviewsCollection
                .find({})
                .sort({ rating: -1 })
                .limit(6)
                .toArray();
            res.send(result);
        });
    } finally {
        // Any cleanup logic if needed
    }
}

// This is the key part to export the Express app for serverless handling in Vercel
module.exports = (req, res) => {
    return app(req, res);  // Handles all the requests for the routes you define
};

run().catch(console.dir);
