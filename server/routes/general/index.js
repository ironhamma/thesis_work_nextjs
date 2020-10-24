const express = require('express');
const nextConnect = require('next-connect');
const handler = nextConnect();
/* const router = express.Router(); */

handler.get("/news", (req, res, next) => {
    console.log("news");
    next();
});

handler.get("/about", (req, res, next) => {
    console.log("about");
    next();
});

handler.get("/login", (req, res, next) => {
    console.log("login");
    next();
});

handler.get("/register", (req, res, next) => {
    console.log("register");
    next();
});

handler.get("/rules", (req, res, next) => {
    console.log("rules");
    next();
});

handler.get("/", (req, res) => {
    console.log("/");
    next();
});


module.exports = handler;