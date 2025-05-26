const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@sajjadjim15.ac97xgz.mongodb.net/?retryWrites=true&w=majority&appName=SajjadJim15`;

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
        const usersCollection = client.db('ClientDB').collection('users')

        // Add new user information and store that to the MongoDB 
        app.post('/users', async (req, res) => {
            const newUser = req.body
            const result = await usersCollection.insertOne(newUser)
            res.send(result)
        })

        //  ALL Users Information  taken from Database 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        //-------------------------------------------------------------------------------------------------------------
        // Server side Rerlated All CRUD Operation  Part Here 
        //--------------------------------------------------------------------------------------------------------------
        const tasksCollection = client.db('TaskDB').collection('tasks')

        // Add a Task and that store to the MongoDB  
        app.post('/tasks', async (req, res) => {
            const newTask = req.body
            const result = await tasksCollection.insertOne(newTask)
            res.send(result)
        })
        //  single Task Taken code Here 
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.findOne(query)
            res.send(result)
        })
        // Update Task Information -> 
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const filterData = { _id: new ObjectId(id) }
            const options = { upsert: true };
            // Full object select  -> 
            const updatedTask = req.body

            const updatedDoc = {
                $set: updatedTask
            }
            const result = await tasksCollection.updateOne(filterData, updatedDoc, options)
            res.send(result)
        })
        //  ALL Tasks Data get from Database 
        app.get('/tasks', async (req, res) => {
            const result = await tasksCollection.find().toArray();
            res.send(result)
        })
        //Delete (single Task) Task Code 
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.deleteOne(query)
            res.send(result)
        })

        const reviewsCollection = client.db('ReviewsDB').collection('reviews')

        // Add new review from user and store that to the MongoDB 
        app.post('/reviews', async (req, res) => {
            const newReview = req.body
            const result = await reviewsCollection.insertOne(newReview)
            res.send(result)
        })
         //  ALL Users Information  taken from Database 
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result)
        })

        app.get('/reviews/top', async (req, res) => {
            const result = await reviewsCollection
                .find({})
                .sort({ rating: -1 }) 
                .limit(6)
                .toArray();
            res.send(result);
        });
    
    } 
    finally {

    }
}
run().catch(console.dir);


app.get('/tasks', (req, res) => {
    res.send(`<div>
        <h1>All Tasks Are running !!!</h1>
        <P>User Server and Task Server Running ......</P>
        <p>This is a Frelancer server .Here user can add Task and Update Task and User can create Account Here.</p>
        </div>
        `)
})

app.listen(port, () => {
    console.log(`All server is running on port ${port}`)
})

module.exports = app;
