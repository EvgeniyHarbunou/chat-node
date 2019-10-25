const express = require('express');
const WebSocket = require('ws');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');


const port = process.env.PORT || 3000;
var db;
const app = express();
const server = app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .listen(port, () => {
    console.log('Server started on port', port);
});



MongoClient.connect('mongodb+srv://chat:43214321@chatdb-am2y3.gcp.mongodb.net/test?retryWrites=true&w=majority', (err, database)=>{
    if(err){
        return console.log(err);
    }
    db = database.db('angrychatdb');
   
})


const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

});





// --------------------------------API -----------------------------

app.get('/', (_, res)=>{
    res.send('Welcome to chat api');
});

app.post('/users', (req, res)=>{
    const user = req.body;
    db.collection('users').findOne({ name: user.name }, (err, result)=>{
        if(err){
            return res.sendStatus(500);
        }
        if(!result){
            db.collection('users').insertOne(user);
            res.sendStatus(200);
        }else{
            res.sendStatus(501);
        }
    })
})

