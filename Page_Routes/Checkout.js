require("dotenv").config();
const express = require("express");
const Checkout = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


require("dotenv").config();
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
Checkout.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'" , "'unsafe-inline'", Project_URL], // Allow resources from the same origin
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
Checkout.use(cors(
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




Checkout.use(bodyParser.json());
Checkout.use(bodyParser.urlencoded({ extended: true }));
Checkout.use(cookieParser(process.env.COOKIE_SECRET));

module.exports = Checkout;

const { Checkout_Cart } = require("../Page_Controllers/Checkout.js");

const  Verify_User_Page  = require("../utils/Verify_User_Page.js");

Checkout.get("/cart", Verify_User_Page , Checkout_Cart );
