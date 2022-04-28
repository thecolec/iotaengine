// MINUTES.JS
// Cole Cassidy - 2022
// Contains core user functions and routing

// Imports
const express = require('express');
const { normalizeType } = require('express/lib/utils');
const router = express.Router();

const { ObjectId } = require('mongodb');
const dbconn = require('./dbConn');
const validator = require('./validator');

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

const minByOrg = async (id) => {
    try {
        console.log(id);
        const doc = await dbconn.get().collection("minutes").find({"oid": new ObjectId(id)}).toArray();
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const minByID = async (id) => {
    try {
        const doc = await dbconn.get().collection("minutes").findOne({"_id": new ObjectId(id)});
        console.log(id);
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}


// ----- Write -----

const newMin = async (newDoc, user) => {
    var doc = {
        createDate: new Date(),
        modDate: new Date(),
        oid: ObjectId(newDoc.oid),
        title: newDoc.title,
        state: "open",
        creator: {
            uName: user.uName,
            fName: user.fName,
            lName: user.lName,
            uid: user._id,

        },
        contents: newDoc.contents
    }
    var resp = await dbconn.get().collection("minutes").insertOne(doc);
    return resp;
}



// ========================================
//             Express Routes
// ========================================
router.use((req, res, next) => {
    console.log("REQ: MIN "+"IP: "+req.ip+" : "+req.url);
    next()
});

// ---- GET ----

router.get('/', async (req, res) => {
    const doc = await listAll();
    res.json(doc);
});

router.get('/org/:oid', async (req, res) => {
    console.log("MINUTES BY OID: "+req.params.oid);
    const resp = await minByOrg(req.params.oid);
    res.json(resp);
});

router.get('/s/:id', async (req, res) => {
    const resp = await minByID(req.params.id);
    res.json(resp);
});

// ---- POST ----

router.post('/new', validator.checkToken, validator.authUser, async (req, res) => {
    const resp = await newMin(req.body, req.user);
    res.json(resp);
})

module.exports = {
    router
}