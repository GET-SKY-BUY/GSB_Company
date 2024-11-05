const express = require('express');
const pug = require('pug');
const cookieParser = require('cookie-parser');

const Auth = express.Router();
const Cookie_Secret = process.env.COOKIE_SECRET;
Auth.use(cookieParser(Cookie_Secret));

const  Verify_User_Page  = require("../utils/Verify_User_Page.js");

const { Signup, Verify_OTP , Login } = require("../Page_Controllers/Authentication.js");



require("dotenv").config();
const bodyParser = require('body-parser');
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
            scriptSrcAttr: ["'self'", "'unsafe-inline'", Project_URL],
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
Auth.get("/signup", Signup);
Auth.get("/verify-otp", Verify_OTP);
Auth.get("/login", Login);
module.exports = Auth;