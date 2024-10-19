const express = require('express');
const pug = require('pug');
const cookieParser = require('cookie-parser');

const Auth = express.Router();
const Cookie_Secret = process.env.COOKIE_SECRET;
Auth.use(cookieParser(Cookie_Secret));

const  Verify_User  = require("../utils/Verify_User.js");

const { Signup } = require("../Page_Controllers/Authentication.js");


// User Authentication
Auth.get("/signup", Signup);
module.exports = Auth;