// IOTA.JS
// Cole Cassidy - 2022
// Primary application logic.

const { query } = require('express');
const res = require('express/lib/response');

// MongoDB library
var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost/iotattestingdb';

var ERRJSONNull = {Error: true, msg: "Null JSON returned from DB"};

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

// equivalent to "findOne"
singleRequest = (q, callback) => {
    MongoClient.connect(dburl, (err, db) => {
        if(err) throw err;
        var dbo = db.db("iotatestingdb");
        dbo.collection(q.dbname).findOne(q.payload, (err, result) => {
            if(err) throw err;
            db.close();
            //console.log(result);
            if(result == null) result = ERRJSONNull;
            callback(result);
        });
    });
}

multiRequest = (q, callback) => {
    MongoClient.connect(dburl, (err, db) => {
        if(err) throw err;
        var dbo = db.db("iotatestingdb");
        dbo.collection(q.dbname).find(q.payload).toArray().then(results => {
            callback(results);
        });
    });
}

multiRequestNoPayload = (q, callback) => {
    MongoClient.connect(dburl, (err, db) => {
        if(err) throw err;
        var dbo = db.db("iotatestingdb");
        dbo.collection(q.dbname).find().toArray().then(results => {
            callback(results);
        });
    });
}

exports.finduser = (uid, res) => {
    var query = {
        dbname: "users",
        payload: {
            id: parseInt(uid)
        }
    }
    singleRequest(query, (msg) => res.json(msg));
}

exports.findorg = (oid, res) => {
    var query = {
        dbname: "organizations",
        payload: {
            id: parseInt(oid)
        }
    }
    singleRequest(query, (msg) => res.json(msg));
}

exports.listusers = (req, res) => {
    var query = {
        dbname: "users",
        payload: {
        }
    }
    multiRequestNoPayload(query, (msg) => res.json(msg));
}

exports.listUsersByOrg = (req, res) => {
    var query = {
        dbname: "users",
        payload: {
            org: parseInt(req)
        }
    }
    multiRequest(query, (msg) => res.json(msg));
}

exports.listorgs = (req, res) => {
    var query = {
        dbname: "organizations",
        payload: {
        }
    }
    multiRequestNoPayload(query, (msg) => res.json(msg));
}