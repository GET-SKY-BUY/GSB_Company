require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
const { Pin_Codes } = require("../Controllers/Additionals.js");
const Verify_User_API = require("../utils/Verify_User_API.js");
const Additional = express.Router();
module.exports = Additional;


Additional.use(cookieParser(Cookie_Secret));
Additional.use(bodyParser.urlencoded({ extended: true }));
Additional.use(bodyParser.json());

// User Additionals
Additional.post("/pincode/:id", Verify_User_API , Pin_Codes );

