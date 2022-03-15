// INDEX.JS
// Cole Cassidy - 2022
// Express API router.

// external libraries
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

// internal libraries
var iota = require('./iota.js');

app.use(express.json());

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
app.get('/user/:uid', (req, res) => {
    iota.finduser(req.params.uid, res);
    console.log("User Request Received");
});

// /user/list returns JSON of all registered users.
app.get('/users', (req, res) => {
    iota.listusers(req, res);
});

app.get('/users/org/:oid', (req, res) => {
    iota.listUsersByOrg(req.params.oid, res);
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
    console.log("Organization Request Received");
});

app.get('/org/:oid', (req, res) => {
    iota.findorg(req.params.oid, res);
    console.log("Org Req Received")
})

// /org/list returns JSON array of all registered organizations
app.get('/orgs', (req, res) => {
    iota.listorgs(req, res);
});


app.listen(port);
console.log('API START');