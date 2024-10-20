require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const Profile = express.Router();
module.exports = Profile;

Profile.use(cookieParser(process.env.COOKIE_SECRET));
Profile.use(bodyParser.urlencoded({ extended: true }));
Profile.use(bodyParser.json());

const { Home , Setting , Coins , Profile_Wishlist } = require("../Page_Controllers/Page_Profile_Controllers.js");

const  Verify_User_Page  = require("../utils/Verify_User_Page.js");


Profile.get("/", Verify_User_Page , Home);
Profile.get("/setting", Verify_User_Page , Setting);
Profile.get("/coins", Verify_User_Page , Coins);
Profile.get("/wishlist", Verify_User_Page , Profile_Wishlist);

