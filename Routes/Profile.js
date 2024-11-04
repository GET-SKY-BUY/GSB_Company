require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
const { Profile_Setting , Profile_Update_Bank , Profile_Address_Add , Profile_Address_Edit , Profile_Address_Delete , Profile_Address_Active_Status } = require("../Controllers/Profile.js");
const Verify_User_API = require("../utils/Verify_User_API.js");
const Profile = express.Router();
module.exports = Profile;

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



Profile.use(cookieParser(Cookie_Secret));
Profile.use(bodyParser.urlencoded({ extended: true }));
Profile.use(bodyParser.json());

// User Profile
Profile.put("/settings", Verify_User_API , Profile_Setting);
Profile.put("/update-bank", Verify_User_API , Profile_Update_Bank);
Profile.post("/address", Verify_User_API , Profile_Address_Add);
Profile.put("/address", Verify_User_API , Profile_Address_Edit);
Profile.delete("/address", Verify_User_API , Profile_Address_Delete);
Profile.patch("/address", Verify_User_API , Profile_Address_Active_Status);

