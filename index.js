const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.POST || 5000;
const app = express()


// app.use(cors({
// origin: "*"
// }));




//modeleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewqse.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect();
        const servicesCollection = client.db('todo-task').collection('services');
        const completeCollection = client.db('todo-task').collection('complete');


        app.post('/complete', async (req, res) => {
            const listcomplete = req.body;
            const result = await completeCollection.insertOne(listcomplete);
            res.send(result);

        })

        app.delete('/complete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await completeCollection.deleteOne(query);
            res.send(result)
          })

          app.get('/complete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await completeCollection.findOne(query);
            res.send(result)
          })


          app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query);
            res.send(result)
          })

         // all service data load kora display te
         app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        
         app.get('/complete', async (req, res) => {
            const query = {};
            const cursor = completeCollection.find(query);
            const complet = await cursor.toArray();
            res.send(complet);
        });

        //single data id set korar jonno


        app.post('/services', async (req, res) => {
            const list = req.body;
            const result = await servicesCollection.insertOne(list);
            res.send(result);

        })


    }

    finally {

    }

}


run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from todo!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ToDo ${port}`)
})