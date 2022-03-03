// INDEX.JS
// Cole Cassidy - 2022
// Express API router.

// external libraries
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost/iotattestingdb';

// internal libraries
var iota = require('./iota.js');

app.get('/', (req, res) => {
    res.send("Hello World");
    console.log("Request Received");
});

// Authentication API
app.get('/auth', (req, res) => {
    res.send("Future Authentication Endpoint")
    console.log("Auth Request Received");
});

// User API
app.get('/user', (req, res) => {
    res.send("Future User Endpoint");
    console.log("User Request Received");
});
app.get('/user/add', (req, res) => {
    iota.createuser("add");
    res.send("Added")
})

// Organization API
app.get('/org', (req, res) => {
    res.send("Future Organization Endpoint");
    console.log("Organization Request Received");
})

app.listen(port);
console.log('API START');