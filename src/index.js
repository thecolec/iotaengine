var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost/iotattestingdb';

app.get('/', (req, res) => {
    res.send("Hello World");
    console.log("Request Received");
});

app.get('/auth', (req, res) => {
    res.send("Future Authentication Endpoint")
    console.log("Auth Request Received");
});

app.get('/user', (req, res) => {
    res.send("Future User Endpoint");
    console.log("User Request Received");
});

app.get('/org', (req, res) => {
    res.send("Future Organization Endpoint");
    console.log("Organization Request Received");
})

app.listen(port);
console.log('API START');