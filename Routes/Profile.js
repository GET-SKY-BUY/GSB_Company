require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
const { Profile_Setting } = require("../Controllers/Profile.js");
const Verify_User_API = require("../utils/Verify_User_API.js");
const Profile = express.Router();
module.exports = Profile;


Profile.use(cookieParser(Cookie_Secret));
Profile.use(bodyParser.urlencoded({ extended: true }));
Profile.use(bodyParser.json());

// User Profile
Profile.put("/settings", Verify_User_API , Profile_Setting);

