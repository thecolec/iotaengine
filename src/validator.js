// VALIDATOR.JS
// Cole Cassidy - 2022
// Validates all tokens

// Imports
const express = require('express');

const jwt = require('jsonwebtoken');

const iota = require('./iota');

// ========================================
//          Load Conf From Iota
// ========================================
// Any local variables should get declared based off of what is implemented in the
// primary iota.js file. This is done to centralize configuration.

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

module.exports = checkToken;