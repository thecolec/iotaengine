// AUTHENTICATION.JS
// Cole Cassidy - 2022
// Handles server side authentication via JSON Web Tokens

// Imports
const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');
const dbconn = require('./dbConn');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const iota = require('./iota');
const { hash } = require('bcrypt');

const validator = require('./validator');

// ========================================
//          Load Conf From Iota
// ========================================
// Any local variables should get declared based off of what is implemented in the
// primary iota.js file. This is done to centralize configuration.

//TODO: Allow for token revocation.
//TODO: Implement routine token refresh

// ========================================
//        Authentication Functions
// ========================================

// ----- Core -----

const regUser = async (user) => {
    // Registers a new user in the database.
    // Creates unique entry in both user and auth databases
    var result;

    // create doc for user db
    newUsr = {
        "uName": user.uName.toUpperCase(),
        "fName": user.fName,
        "lName": user.lName,
        "rank": 0,
        "joindate": new Date()
    }

    // create doc for auth db
    secUsr = {
        "uName": user.uName.toUpperCase()
    }

    // perform duplicate check against user db
    var check = await checkUserExists(user.uName.toUpperCase());
    if(check) {
        return iota.ERR.UserExists;
    }

    // append hashed password to auth db doc
    secUsr.pWord = await passCrypt(user.pWord);

    // write new user doc to user db
    try {
        result = await dbconn.get().collection("users").insertOne(newUsr);
        result = newUsr;
    } catch(e) {
        console.error(e);
        return iota.ERR.Unknown;
    }

    // generate a user unique token
    token = await makeToken(result);

    // append unique token to auth doc
    secUsr.uid = result._id;
    secUsr.token = [token];

    // write auth doc to db
    dbconn.get().collection("auth").insertOne(secUsr);

    // append new token to result for the registering application
    result.token = token;
    return result;
}

const authUser = async (doc) => {
    const userAuth = await dbconn.get().collection("auth").findOne({"uName": doc.uName.toUpperCase()});

    if(userAuth == null) return iota.ERR.UserDNE;

    const user = await dbconn.get().collection("users").findOne({"_id":userAuth.uid});

    if(await bcrypt.compare(doc.pWord, userAuth.pWord)){
        token = await makeToken(user);
        user.token = token;
        return user;
    }
    return iota.ERR.RequestInvalid;
}

// ----- Support -----

const checkUserExists = async (name) => {
    // Returns True if user exists. Otherwise returns false.
    // Also returns true if error occurs in order to protect DB from duplicates.
    try {
        const doc = await dbconn.get().collection("users").findOne({"uName": name.toUpperCase()});
        if(doc != null) return true;
        return false;
    } catch(e) {
        console.error(e);
        return true;
    }
}

const passCrypt = async (badPass) => {
    // Hashes cleartext password.
    return await bcrypt.hash(badPass, iota.AUTHCONFIG.SaltRounds);
}

const makeToken = async (user) => {
    // Creates new token from provided user doc
    const token = jwt.sign(
        user,
        iota.AUTHCONFIG.TokenKey
    );
    return token;
}

const updateToken = async (user) => {
    try {
        const newDoc = await dbconn.get().collection("users").findOne({"_id": new ObjectId(user._id)});
        const token = jwt.sign(
            newDoc,
            iota.AUTHCONFIG.TokenKey
        );
        return token;
    } catch(e){
        console.error("Failed Token Update");
        return iota.ERR.Unknown;
    }
}
// ------ Express Token Validator -----

const checkToken = (req, res, next) => {
    const token = req.body.token || req.headers["x-access-token"];
    if(token == null) return res.status(403).json(iota.ERR.RequestInvalid);
    try {
        req.user = jwt.verify(token, iota.AUTHCONFIG.TokenKey);
    } catch(e){
        console.log(e);
        return res.status(401).json(iota.ERR.RequestInvalid);
    }
    return next();
}


// ========================================
//              Express Routes
// ========================================

router.use((req, res, next) => {
    console.log("REQ: AUT  IP: "+req.ip);
    next();
});

// ---- GET ----

router.get('/update', validator.checkToken, async (req, res) => {
    const doc = await updateToken(req.user);
    res.json(doc);
});

// ---- POST ----

router.post('/', async (req, res) => {
    const doc = await authUser(req.body);
    res.json(doc);
});

router.post('/reg', async (req, res) => {
    const doc = await regUser(req.body);
    res.json(doc);
});


module.exports = {
    router,
    checkToken
}