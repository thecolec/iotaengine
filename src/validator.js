// VALIDATOR.JS
// Cole Cassidy - 2022
// Validates all tokens

// Imports
const express = require('express');

const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const iota = require('./iota');

// ========================================
//          Token Validation Functions
// ========================================


const checkToken = (req, res, next) => {
    const token = req.body.token || req.headers["x-access-token"];
    if(token == null) return res.status(403).json(iota.ERR.RequestInvalid);

    // Extract the User Data from the token if possible
    try {
        req.user = jwt.verify(token, iota.AUTHCONFIG.TokenKey);
    } catch(e){
        console.log(e);
        return res.status(401).json(iota.ERR.RequestInvalid);
    }
    return next();
}

const authUser = (req, res, next) => {

    const user = req.user;
    const dest = req.body;

    console.log(req.user);
    console.log(req.body);
    console.log(req.user.orgs.some(org => org.oid === req.body.oid));

    // If user has admin auth allow any action
    if(req.user.rank >= 3) return next();

    // If user is a member of affected group
    if( req.user.orgs.some(org => org.oid === req.body.oid)){
        return next();
    }

    if( req.user.orgs.some(org => org.oid === new ObjectId(req.body.oid))){
        return next();
    }

    if(req.user.orgs.some(org => org.oid === req.params.oid)){
        console.log("hello ");
        return next();
    }

    // If user is affecting self
    if(req.user._id === ObjectId(req.body.uid)){
        return next();
    }
    return res.status(401).json(iota.ERR.Unauthorized);

}

module.exports = {
    checkToken,
    authUser
}