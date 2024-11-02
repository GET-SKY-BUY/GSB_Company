require('dotenv').config();
const Payment_System = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
module.exports = Payment_System;


const Verify_User_API = require('../utils/Verify_User_API.js');
const { Payment_Home } = require('../Controllers/Payment_System.js');

Payment_System.use(cookieParser(Cookie_Secret));
Payment_System.use(bodyParser.urlencoded({ extended: true }));
Payment_System.use(bodyParser.json());

Payment_System.post("/", Verify_User_API , Payment_Home );