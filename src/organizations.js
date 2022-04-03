// ORGANIZATIONS.JS
// Cole Cassidy - 2022
// Contains core organization functions and routing

// Imports
const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');
const dbconn = require('./dbConn');

const ERRUnkown         = {Error: true, msg:"Unknown Error. Server may still be initializing."};

// ========================================
//              DB Functions
// ========================================

const findOrg = async (uid) => {
    try {
        const doc = await dbconn.get().collection("organizations").findOne({"_id": new ObjectId(uid)});
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const listAllOrgs = async () => {
    try {
        const doc = await dbconn.get().collection("organizations").find().toArray();
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const listOrgUsrs = async (oid) => {
    try {
        const doc = await dbconn.get().collection("users").find({"orgs.oid": new ObjectId(oid)}).toArray();
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
    console.log("REQ: ORG "+"IP: "+req.ip);
    next()
});

router.get('/', async (req, res) => {
    const doc = await listAllOrgs();
    res.json(doc);
});

router.get('/list', async (req, res) => {
    const doc = await listAllOrgs();
    res.json(doc);
});

router.get('/s/:oid', async (req, res) => {
    const doc = await findOrg(req.params.oid);
    res.json(doc);
    //6234ec073b13b586a6b369fc
});

router.get('/s/:oid/users', async (req, res) => {
    const doc = await listOrgUsrs(req.params.oid);
    res.json(doc);
    //6234ec073b13b586a6b369fc
});


router.get('/s/:oid/full', async (req, res) => {
    const usrDoc = listOrgUsrs(req.params.oid);
    const orgDoc = findOrg(req.params.oid);
    Promise.all([usrDoc, orgDoc, testDelay]).then((values) => {
        console.log(values);
    });
})

module.exports = {
    router
}