// ORGANIZATIONS.JS
// Cole Cassidy - 2022
// Contains core organization functions and routing

// Imports
const { promise } = require('bcrypt/promises');
const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');
const dbconn = require('./dbConn');
const iota = require('./iota');
const validator = require('./validator');


const ERRUnkown         = {Error: true, msg:"Unknown Error. Server may still be initializing."};

// ========================================
//              DB Functions
// ========================================

// ----- READ -----

const findOrg = async (uid) => {
    try {
        const doc = await dbconn.get().collection("organizations").findOne({"_id": new ObjectId(uid)});
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const findOrgVerbose = async (oid) => {
    const usrDoc = listOrgUsrs(oid);
    const orgDoc = findOrg(oid);
    return Promise.all([usrDoc, orgDoc]).then((values) => {
        var doc = values[1];
        doc.members = values[0];
        return doc;
    });
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

// ----- WRITE -----

const addUser = async (regCode, user) => {
    const uid = user._id;
    try {
        const org = await dbconn.get().collection("organizations").findOne({"reg.code": regCode});
        const filter = {"_id": ObjectId(uid)};
        const change = { "$addToSet": { 
            "orgs": {
                "Name": org.Name,
                "oid": org._id
            }
        }};
        const result = await dbconn.get().collection("users").updateOne(filter,change,{});
        console.log("uid: "+uid+" linked to oid: "+org._id);
        console.log(result);
    } catch(e) {
        console.error(e);
        return iota.ERR.Unknown;
    }
}

// ========================================
//           Registration Codes
// ========================================
// TODO Clean and Optimize

// Validates regCode
const regCode = async (oid) => {
    const doc = await regCodeRefresh(oid);
    console.log( doc );
    return doc.reg.code;
}

// checks if regCode is stale and updates the doc if so
const regCodeRefresh = async (oid) => {
    var doc = await findOrg(oid);
    const curr = Date.now();

    // if org has no regcode generate a new one.
    if(doc.reg == null ) {
        return await updateRegCode(doc);
    }

    var regExp = doc.reg.exp;
    const diff = curr - regExp;
    const conv = 1000 * 60;

    // if older than one hour create new code and update
    if(diff/conv >= 1) {
        doc = await updateRegCode(doc);
    }

    return doc;
}

// Updates new regCodes
const updateRegCode = async (doc) => {
    const curr = Date.now();

    // mongoDB call to write new code
    const filter = {
        _id: doc._id
    }
    var newCode = await genRegCode();

    const updateCode = {
        $set: {
            'reg': {
                'code': newCode,
                'exp': curr
            }
        }
    }
    const res = await dbconn.get().collection("organizations").updateOne(filter, updateCode);
    
    // update current orgDoc with new code and return
    doc.reg = {
        code: newCode,
        exp: curr
    }

    return doc;
}

// Generate Registration Code
const genRegCode = async () => {

    // Generate Code
    const charset = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    var newRegCode = "";
    for (i = 0; i<6; i++ ){
        newRegCode += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Validate against DB
    try {
        const res = await dbconn.get().collection("organizations").findOne({"reg.code": newRegCode});
        if(res === null) return newRegCode;

    } catch (e) {
        console.error(e);
        return "ERR";
    }
}

// ========================================
//             Express Routes
// ========================================

// Logs traffic to this endpoint.
router.use((req, res, next) => {
    console.log("REQ: ORG "+"IP: "+req.ip+" : "+req.url);
    next()
});

// Lists all organizations
router.get('/', async (req, res) => {
    const doc = await listAllOrgs();
    res.json(doc);
});

// Lists all organizations
router.get('/list', async (req, res) => {
    const doc = await listAllOrgs();
    res.json(doc);
});

// Returns basic organization data.
router.get('/s/:oid', async (req, res) => {
    const doc = await findOrg(req.params.oid);
    res.json(doc);
    //6234ec073b13b586a6b369fc
});

// Returns organization user list
router.get('/s/:oid/users', async (req, res) => {
    const doc = await listOrgUsrs(req.params.oid);
    res.json(doc);
    //6234ec073b13b586a6b369fc
});

// Returns non-stale registration code
router.get('/reg/:oid', async (req, res) => {
    res.json(await regCode(req.params.oid));
})

// Adds user to organization by Registration Code
router.post('/reg/:regcode', validator.checkToken, async(req, res) => {
    const doc = await addUser(req.params.regcode, req.user);
    res.json();
})

// Returns verbose organization data.
router.get('/s/:oid/full', validator.checkToken, validator.authUser, async (req, res) => {
    res.json( await findOrgVerbose(req.params.oid) );
})

module.exports = {
    router
}