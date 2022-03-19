// IOTA.JS
// Cole Cassidy - 2022
// Primary application logic.

const { query } = require('express');
const assert = require('assert');
const res = require('express/lib/response');

const { MongoClient, ObjectId } = require('mongodb');
const { Console } = require('console');

// MongoDB library
const uri = "mongodb+srv://iotabot:jameshalliday@cluster0.m5mj8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri);


const ERRJSONNull = {Error: true, msg: "Null JSON returned from DB"};
const ERRRequestInvalid = {Error: true, msg:"Inproper Request"};

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
    console.log("connected :D");
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
    const doc = await mongodb.db("iota_testing").collection("users").findOne({"_id": ObjectId(uid)});
    return doc;
}

const listAllUsers = async () => {
    const doc = await mongodb.db("iota_testing").collection("users").find().toArray();
    return doc;
}

const findOrg = async (uid) => {
    const doc = await mongodb.db("iota_testing").collection("organizations").findOne({"_id": ObjectId(uid)});
    return doc;
}

const listAllOrgs = async () => {
    const doc = await mongodb.db("iota_testing").collection("organizations").find().toArray();
    return doc;
}

exports.findUser = findUser;
exports.findOrg = findOrg;
exports.listAllUsers = listAllUsers;
exports.listAllOrgs = listAllOrgs;