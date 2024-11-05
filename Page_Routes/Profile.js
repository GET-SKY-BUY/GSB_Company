require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const Profile = express.Router();
module.exports = Profile;

Profile.use(cookieParser(process.env.COOKIE_SECRET));
Profile.use(bodyParser.urlencoded({ extended: true }));
Profile.use(bodyParser.json());

const { Home , Setting , Coins , Profile_Wishlist , Profile_Favourite , Profile_Notification , Profile_Address } = require("../Page_Controllers/Page_Profile_Controllers.js");

const  Verify_User_Page  = require("../utils/Verify_User_Page.js");


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
Profile.use(helmet({
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
Profile.use(cors(
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




Profile.use(bodyParser.json());
Profile.use(bodyParser.urlencoded({ extended: true }));
Profile.use(cookieParser(process.env.COOKIE_SECRET));


Profile.get("/", Verify_User_Page , Home);
Profile.get("/setting", Verify_User_Page , Setting);
Profile.get("/coins", Verify_User_Page , Coins);
Profile.get("/wishlist", Verify_User_Page , Profile_Wishlist);
Profile.get("/favourite", Verify_User_Page , Profile_Favourite);
Profile.get("/notification", Verify_User_Page , Profile_Notification);
Profile.get("/address", Verify_User_Page , Profile_Address);