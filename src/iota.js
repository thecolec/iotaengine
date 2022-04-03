// IOTA.JS
// Cole Cassidy - 2022
// Primary application logic.

const { query } = require('express');
const assert = require('assert');
const res = require('express/lib/response');

const { MongoClient, ObjectId } = require('mongodb');

const dbconn = require('./dbConn');

const ERRJSONNull       = {Error: true, msg: "Null JSON returned from DB"};
const ERRRequestInvalid = {Error: true, msg:"Inproper Request"};
const ERRUnkown         = {Error: true, msg:"Unknown Error. Server may still be initializing."};
const NOERR             = {Error: false, msg:"Operation Succesful."}

// Standard Database access functions
// Handle all database requests using the above query format.
// Keep asynchronous


const testConn = async () => {
    try {
        // mongodb.db("iota_testing").command({ping: 1});
        const doc = await dbconn.get().collection("users").find().toArray();
        console.log(doc);
        //await client.db("iota_testing").command({ping: 1});
    } finally {
    }
}

const addOrgToUsr = async (uid, oid) => {
    try {
        const oq = await dbconn.get().collection("organizations").findOne({"_id": ObjectId(oid)});
        console.log(oq);
        const q = {"_id": ObjectId(uid)};
        const r = { "$addToSet": { 
            "orgs": {
                "Name": oq.Name,
                "oid": ObjectId(oid)
            }
        }};
        const result = await dbconn.get().collection("users").updateOne(q,r,{});
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
        dbchk = await dbconn.get().collection("users").findOne({"uName": newUsr.uName});
    } catch(e) {
        console.error(e);
        return ERRUnkown
    }
    if (dbchk != null) return {Error: true, msg:"User Name Already Exists"};
    const result = await dbconn.get().collection("users").insertOne(newUsr);


}

// const functName = async () => {
//     try {

//     } catch(e) {
//         console.error(e);
//         return ERRUnkown;
//     }
// }


module.exports = {
    testConn,
    addOrgToUsr,
    createUser
}