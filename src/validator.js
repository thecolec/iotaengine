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

    // If user has admin auth allow any action
    if(req.user.rank >= 3) return next();

    // If user is a member of affected group
    if(req.user.orgs.some(org => org.oid === ObjectId(req.body.oid))){
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