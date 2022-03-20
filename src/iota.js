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

const addOrgToUsr = async (uid, oid) => {
    try {
        const oq = await mongodb.db("iota_testing").collection("organizations").findOne({"_id": ObjectId(oid)});
        console.log(oq);
        const q = {"_id": ObjectId(uid)};
        const r = { "$addToSet": { 
            "orgs": {
                "Name": oq.Name,
                "oid": ObjectId(oid)
            }
        }};
        const result = await mongodb.db("iota_testing").collection("users").updateOne(q,r,{});
        console.log("uid: "+uid+" linked to oid: "+oid);
        console.log(result);
    } catch(e) {
        console.error(e);
        return ERRUnkown
    }
}

const createUser = async (usr) => {
    newUsr = {
        "uName": usr.uName.toUpperCase(),
        "fName": usr.fName,
        "lName": usr.lName,
        "joindate": new Date()
    }
    var dbchk;
    try{
        dbchk = await mongodb.db("iota_testing").collection("users").findOne({"uName": newUsr.uName});
    } catch(e) {
        console.error(e);
        return ERRUnkown
    }
    if (dbchk != null) return {Error: true, msg:"User Name Already Exists"};
    const result = await mongodb.db("iota_testing").collection("users").insertOne(newUsr);


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
exports.addOrgToUsr = addOrgToUsr;
exports.createUser = createUser;