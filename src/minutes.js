// MINUTES.JS
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

// ----- Read -----

const listAll = async () => {
    try {
        const doc = await dbconn.get().collection("minutes").find().toArray();
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}


// ----- Write -----

const newMin = async (oid) => {
    var doc = {
        createDate: new Date(),
        modDate: new Date(),
        oid: ObjectId(oid),
        state: "open",
        sections: []
    }
    dbconn.get().collection("minutes").insertOne(doc);
}



// ========================================
//             Express Routes
// ========================================
router.use((req, res, next) => {
    console.log("REQ: MIN "+"IP: "+req.ip);
    next()
});

// ---- GET ----

router.get('/', async (req, res) => {
    const doc = await listAll();
    res.json(doc);
});

// ---- POST ----

router.post('/new', async (req, res) => {
    const resp = await newMin(req.body.oid);
    res.json(resp)
})

module.exports = {
    router
}