require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Auth = express.Router();

const Cookie_Secret = process.env.COOKIE_SECRET;
Auth.use(cookieParser(Cookie_Secret));
const { Signup } = require("../Controllers/User_Authentication.js");
const  Verify_User  = require("../utils/Verify_User.js");
module.exports = Auth;



Auth.use(bodyParser.urlencoded({ extended: true }));
Auth.use(bodyParser.json());
// User Authentication
Auth.post("/signup" , Signup);
// Auth.post("/signup-verify-otp", Signup);
// Auth.post("/login", Signup);
// Auth.post("/login-verify-otp", Signup);
// Auth.post("/forgot-password", Signup);
// Auth.post("/reset-password", Signup);
