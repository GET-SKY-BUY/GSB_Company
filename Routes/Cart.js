require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cookie_Secret = process.env.COOKIE_SECRET;
const Verify_User_API = require("../utils/Verify_User_API.js");
const Cart_Route = express.Router();
const helmet = require('helmet');
const cors = require('cors');
module.exports = Cart_Route;

// Protocol 
let Protocol = "http";
if (process.env.NODE_ENV === 'production') {
    Protocol = 'https';
};
// Project URL
const Project_URL = `${Protocol}://${process.env.PROJECT_DOMAIN}`;

// Helmet middleware for securing the app
Cart_Route.use(helmet({
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
Cart_Route.use(cors(
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



Cart_Route.use(cookieParser(Cookie_Secret));
Cart_Route.use(bodyParser.urlencoded({ extended: true }));
Cart_Route.use(bodyParser.json());

const { Add_To_Cart , Buy_Now , Favourite_Add , Favourite_Add_Remove , Cart_Remove_Product } = require("../Controllers/Cart.js");

Cart_Route.post("/add", Verify_User_API , Add_To_Cart );
Cart_Route.post("/buy_now", Verify_User_API , Buy_Now );
Cart_Route.post("/favourite", Verify_User_API , Favourite_Add );
Cart_Route.post("/favourite/remove", Verify_User_API , Favourite_Add_Remove );

Cart_Route.delete("/remove", Verify_User_API , Cart_Remove_Product );





// Cart_Route.post("//buy_now", Verify_User_API , Add_To_Cart );