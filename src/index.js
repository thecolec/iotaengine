// INDEX.JS
// Cole Cassidy - 2022
// Express API router.

// external libraries
var cors = require('cors');
var bodyParser = require('body-parser');

var express = require('express'),
    app = express(),
    port = 3000;


app.use(cors());

// internal libraries
var iota = require('./iota.js');
const iotaDB = require('./dbConn.js');
const orgs = require('./organizations');
const users = require('./users');
const minutes = require('./minutes');
const auth = require('./authentication');
const validator = require('./validator');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/', async (req, res) => {
    try{
        await iota.testConn();
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

// Get list of users in specified organization
app.get('/users/org/:oid', async (req, res) => {
    const doc = await orgLib.listOrgUsrs(req.params.oid);
    res.json(doc);
});

// /user/del "deletes" a user by making their account inactive.
app.get('/user/del', (req, res) => {
    iota.removeuser(req);
    res.send("Removed");
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

app.use('/org', orgs.router);
app.use('/usr', users.router);
app.use('/min', minutes.router);
app.use('/auth', auth.router);

console.log("Waiting for DB Connection");
iotaDB.connect(() => {
    app.listen(port);
    console.log('API START');
});
