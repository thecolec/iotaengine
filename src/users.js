// USERS.JS
// Cole Cassidy - 2022
// Contains core user functions and routing

// Imports
const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');
const dbconn = require('./dbConn');

const ERRUnknown         = {Error: true, msg:"Unknown Error. Server may still be initializing."};

// ========================================
//              DB Functions
// ========================================

// ----- Read -----

const findUser = async (uid) => {
    try {
        const doc = await dbconn.get().collection("users").findOne({"_id": ObjectId(uid)});
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnknown;
    }
}

const listAllUsers = async () => {
    try {
        const doc = await dbconn.get().collection("users").find().toArray();
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnknown;
    }
}

const findUserName = async (name) => {
    try {
        const doc = await dbconn.get().collection("users").findOne({"uName": name});
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnknown;
    }
}

// ----- Write -----

const addUser = async (user) => {
    newUsr = {
        "uName": user.uName.toUpperCase(),
        "fName": user.fName,
        "lName": user.lName,
        "joindate": new Date()
    }
    var check = await findUserName(user.uName.toUpperCase());
    console.log(check);
    if(check != null) return ERRUnknown;
    try {
        var result = await dbconn.get().collection("users").insertOne(newUsr);
        result.document = newUsr;
        return result;
    } catch(e) {
        console.error(e);
        return ERRUnknown;
    }
}

// ========================================
//             Express Routes
// ========================================
router.use((req, res, next) => {
    console.log("REQ: USR  IP: "+req.ip);
    next();
});

router.get('/', async (req, res) => {
    const doc = await listAllUsers();
    res.json(doc);
});

router.get('/s/:uid', async (req, res) => {
    const doc = await findUser(req.params.uid);
    res.json(doc);
});

router.get('/list', async (req, res) => {
    const doc = await listAllUsers();
    res.json(doc);
});

router.post('/add', async (req, res) => {
    const doc = await addUser(req.body);
    res.json(doc);
});

module.exports = {
    router
}