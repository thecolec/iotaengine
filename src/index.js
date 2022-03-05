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
// /user returns JSON for a requested user
app.get('/user', (req, res) => {
    res.send("Future User Endpoint");
    console.log("User Request Received");
});

// /user/list returns JSON of all registered users.
app.get('/user/list', (req, res) => {
    res.send("Future User Endpoint");
    console.log("User Request Received");
});

// /user/add creates a new user using information from the request
app.get('/user/add', (req, res) => {
    iota.createuser("add");
    res.send("Added")
});

// /user/del "deletes" a user by making their account inactive.
app.get('/user/del', (req, res) => {
    iota.removeuser(req);
    res.send("Removed");
});

// Organization API
// /org returns JSON for a requested organization
app.get('/org', (req, res) => {
    res.send("Future Organization Endpoint");
    co
    nsole.log("Organization Request Received");
});

// /org/list returns JSON array of all registered organizations
app.get('/org/list', (req, res) => {
    res.send("Future Organization Endpoint");
});

app.listen(port);
console.log('API START');