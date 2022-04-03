// USERS.JS
// Cole Cassidy - 2022
// Contains core user functions and routing

// Imports
const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');
const dbconn = require('./dbConn');

const ERRUnkown         = {Error: true, msg:"Unknown Error. Server may still be initializing."};

// ========================================
//              DB Functions
// ========================================

const findUser = async (uid) => {
    try {
        const doc = await dbconn.get().collection("users").findOne({"_id": ObjectId(uid)});
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const listAllUsers = async () => {
    try {
        const doc = await dbconn.get().collection("users").find().toArray();
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

// ========================================
//             Express Routes
// ========================================
router.use((req, res, next) => {
    console.log("REQ: USR "+"IP: "+req.ip);
    next()
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

module.exports = {
    router
}