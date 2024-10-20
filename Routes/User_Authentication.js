require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
const Auth = express.Router();
const { Signup , Verify_OTP , OTP_Resend , Login } = require("../Controllers/User_Authentication.js");
module.exports = Auth;



Auth.use(cookieParser(Cookie_Secret));
Auth.use(bodyParser.urlencoded({ extended: true }));
Auth.use(bodyParser.json());
// User Authentication
Auth.post("/signup" , Signup);
Auth.post("/verify-otp", Verify_OTP);
Auth.patch("/verify-otp/resend", OTP_Resend);
Auth.post("/login", Login);
// Auth.post("/change-password", Signup);
// Auth.post("/forgot-password", Signup);
// Auth.post("/reset-password", Signup);
