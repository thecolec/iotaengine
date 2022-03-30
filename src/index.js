// INDEX.JS
// Cole Cassidy - 2022
// Express API router.

// external libraries
var cors = require('cors');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

app.use(cors());

// internal libraries
var iota = require('./iota.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/', async (req, res) => {
    try{
        res.send("Hello World");
    } catch(e) {
        console.log(e)
    }
    
});

// Authentication API
app.get('/auth', (req, res) => {
    res.send("Future Authentication Endpoint")
    console.log("Auth Request Received");
});

// User API
// /user returns JSON for a requested user
app.get('/user/:uid', async (req, res) => {
    try{
        console.log("User Request: "+req.params.uid+" From: "+req.ip);
        const userInfo = await iota.findUser(req.params.uid);
        res.json(userInfo);
    } catch(e) {
        console.log(e);
    }
});

// /user/list returns JSON of all registered users.
app.get('/users', async (req, res) => {
    console.log("User List Request:                           From: "+req.ip);
    const usrList = await iota.listAllUsers();
    res.json(usrList);
});

app.get('/users/org/:oid', (req, res) => {
    iota.listUsersByOrg(req.params.oid, res);
});

// /user/del "deletes" a user by making their account inactive.
app.get('/user/del', (req, res) => {
    iota.removeuser(req);
    res.send("Removed");
});


// Organization API
// /org/<oid> returns the json for a requested organization identified by its OID.
app.get('/org/:oid', async (req, res) => {
    console.log("Org Request: "+req.params.uid+" From: "+req.ip);
    const orgInfo = await iota.findOrg(req.params.uid);
    res.json(orgInfo);
})

// /orgs
app.get('/orgs', async (req, res) => {
    console.log("Org List Request:                           From: "+req.ip);
    const orgInfo = await iota.listAllOrgs();
    res.json(orgInfo);
});

// ===== Editing Functions =====
// link organization to user
app.post("/users/assignOrg", async (req, res) => {
    const resp = await iota.addOrgToUsr(req.body.uid,req.body.oid);
    res.json(resp);
});


// Create a new User
app.post('/user/add', async (req, res) => {
    const resp = await iota.createUser(req.body);
    res.json(resp);
});


app.listen(port);
console.log('API START');
console.log("Waiting for DB Connection");