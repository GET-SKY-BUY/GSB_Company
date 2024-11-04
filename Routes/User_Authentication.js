require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
const Auth = express.Router();
const { Signup , Verify_OTP , OTP_Resend , Login , Change_Password } = require("../Controllers/User_Authentication.js");
const Verify_User_API  = require("../utils/Verify_User_API.js");
module.exports = Auth;


// Protocol 
let Protocol = "http";
if (process.env.NODE_ENV === 'production') {
    Protocol = 'https';
};
// Project URL
const Project_URL = `${Protocol}://${process.env.PROJECT_DOMAIN}`;


const helmet = require('helmet');
const cors = require('cors');

// Helmet middleware for securing the app
Auth.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'" , Project_URL], // Allow resources from the same origin
            scriptSrc: ["'self'", "'unsafe-inline'", Project_URL , "https://fonts.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", Project_URL , "https://fonts.googleapis.com"], 
            StyleSheetListSrc: ["'self'", Project_URL , "https://fonts.googleapis.com"], // Allow stylesheets
            imgSrc: ["'self'", "data:", Project_URL],
        }
    },
    frameguard: { action: 'deny' }, // Prevent clickjacking by denying framing
    hsts: { maxAge: 31536000 }, // Enforce HTTPS for 1 year
    xssFilter: true, // Enable XSS filter in browsers
    noSniff: true, // Prevent MIME sniffing
    hidePoweredBy: true,
}));

// Setup cors middleware for cross-origin requests
Auth.use(cors(
    {
        origin: [
            Project_URL,
            "http://localhost:80",
            "https://www.google.com",
            "https://google.com",
            "https://bing.com",
            "https://www.bing.com",
        ],
        credentials: true,
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Length', 'X-Knowledge-Base'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
));



Auth.use(cookieParser(Cookie_Secret));
Auth.use(bodyParser.urlencoded({ extended: true }));
Auth.use(bodyParser.json());
// User Authentication
Auth.post("/signup" , Signup);
Auth.post("/verify-otp", Verify_OTP);
Auth.patch("/verify-otp/resend", OTP_Resend);
Auth.post("/login", Login);
Auth.put("/change-password", Verify_User_API , Change_Password);
// Auth.post("/forgot-password", Signup);
// Auth.post("/reset-password", Signup);
