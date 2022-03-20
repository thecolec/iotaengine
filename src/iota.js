// IOTA.JS
// Cole Cassidy - 2022
// Primary application logic.

const { query } = require('express');
const assert = require('assert');
const res = require('express/lib/response');

const { MongoClient, ObjectId } = require('mongodb');
const { Console } = require('console');
const { ObjectID } = require('bson');

// MongoDB library
const uri = "mongodb+srv://iotabot:jameshalliday@cluster0.m5mj8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri);


const ERRJSONNull       = {Error: true, msg: "Null JSON returned from DB"};
const ERRRequestInvalid = {Error: true, msg:"Inproper Request"};
const ERRUnkown         = {Error: true, msg:"Unknown Error. Server may still be initializing."};
const NOERR             = {Error: false, msg:"Operation Succesful."}

exports.createuser = (msg) => {
    console.log(msg);
}

/*      === SAMPLE QUERY FORMAT ===
q           -       json obj for making db request
q.dbname    -       indicates database name
q.payload   -       contains the query to be sent to the database
*/

// Standard Database access functions
// Handle all database requests using the above query format.
// async friendly
// not structurally necessary, but makes development significantly easier.

// Creates a pooled connection for db calls.
MongoClient.connect(uri, (err, db) => {
    assert.equal(null, err);
    mongodb = db;
    mdb = db.db("iota_testing");
    console.log("Connected :D");
})


exports.testConn = async () => {
    try {
        mongodb.db("iota_testing").command({ping: 1});
        //await client.db("iota_testing").command({ping: 1});
        console.log("Connected :D");
    } finally {
    }
}

// exports.finduser = (uid, res) => {
//     var query = {
//         dbname: "users",
//         payload: {
//             id: parseInt(uid)
//         }
//     }
//     singleRequest(query, (msg) => res.json(msg));
// }

const findUser = async (uid) => {
    try {
        const doc = await mongodb.db("iota_testing").collection("users").findOne({"_id": ObjectId(uid)});
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const listAllUsers = async () => {
    try {
        const doc = await mongodb.db("iota_testing").collection("users").find().toArray();
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const findOrg = async (uid) => {
    try {
        const doc = await mongodb.db("iota_testing").collection("organizations").findOne({"_id": ObjectId(uid)});
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const listAllOrgs = async () => {
    try {
        const doc = await mongodb.db("iota_testing").collection("organizations").find().toArray();
        return doc;
    } catch(e) {
        console.error(e);
        return ERRUnkown;
    }
}

const addUsrToOrg = async (uid, oid) => {
    try {
        const q = {"_id": ObjectId(uid)};
        const r = { "$push": { "orgs": ObjectId(oid)}};
        const result = await mongodb.db("iota_testing").collection("users").updateOne(q,r,{});
        console.log("uid: "+uid+" Added to oid: "+oid);
        const q2 = {"_id": ObjectId(oid)};
        const r2 = {"$push": {"members": ObjectId(uid)}};
        const result2 = await mongodb.db('iota_testing').collection("organizations").updateOne(q2,r2,{});
        console.log(result);
    } catch(e) {
        console.error(e);
        return ERRUnkown
    }
}

// const functName = async () => {
//     try {

//     } catch(e) {
//         console.error(e);
//         return ERRUnkown;
//     }
// }

exports.findUser = findUser;
exports.findOrg = findOrg;
exports.listAllUsers = listAllUsers;
exports.listAllOrgs = listAllOrgs;
exports.addUsrToOrg = addUsrToOrg;