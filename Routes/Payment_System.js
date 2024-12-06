require('dotenv').config();
const Payment_System = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
module.exports = Payment_System;


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
Payment_System.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'" , Project_URL], // Allow resources from the same origin
            scriptSrc: ["'self'", "'unsafe-inline'", Project_URL , "https://fonts.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", Project_URL , "https://fonts.googleapis.com"], 
            StyleSheetListSrc: ["'self'", "'unsafe-inline'", Project_URL , "https://fonts.googleapis.com"], // Allow stylesheets
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
Payment_System.use(cors(
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



const Verify_User_API = require('../utils/Verify_User_API.js');
const { Payment_Home , Payment_Create_Order , Verify_Payment_Signature } = require('../Controllers/Payment_System.js');

Payment_System.use(cookieParser(Cookie_Secret));
Payment_System.use(bodyParser.urlencoded({ extended: true }));
Payment_System.use(bodyParser.json());

Payment_System.post("/", Verify_User_API , Payment_Home );
Payment_System.post("/create_order", Verify_User_API , Payment_Create_Order );
Payment_System.patch("/verify_payment_signature", Verify_User_API , Verify_Payment_Signature );