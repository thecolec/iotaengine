// dbConn.JS
// Cole Cassidy - 2022
// Handles all database communication.

const assert = require('assert');
const res = require('express/lib/response');

const { MongoClient, ObjectId } = require('mongodb');

// MongoDB URI
const uri = "mongodb+srv://iotabot:jameshalliday@cluster0.m5mj8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// JSON Error Responses
const ERRJSONNull       = {Error: true, msg: "Null JSON returned from DB"};
const ERRRequestInvalid = {Error: true, msg:"Inproper Request"};
const ERRUnkown         = {Error: true, msg:"Unknown Error. Server may still be initializing."};
const NOERR             = {Error: false, msg:"Operation Succesful."}

let iotaDB;

// Standard Database access functions
// Handle all database requests using the above query format.
// async friendly
// not structurally necessary, but makes development significantly easier.

// Creates a pooled connection for db calls.
function connect(callback){
    MongoClient.connect(uri, (err, db) => {
        assert.equal(null, err);
        iotaDB = db.db("iota_testing");
        console.log("Connected :D");
        callback();
    });
}

// MongoClient.connect(uri, (err, db) => {
//     assert.equal(null, err);
//     mongodb = db;
//     dbConn = db.db("iota_testing");
//     console.log("Connected :D");
// })

function get(){
    return iotaDB;
}

function close(){
    iotaDB.close();
}

module.exports = {
    connect,
    get,
    close
}