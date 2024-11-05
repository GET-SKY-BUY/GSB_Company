require("dotenv").config();
const express = require("express");
const Products = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

Products.use(bodyParser.json());
Products.use(bodyParser.urlencoded({ extended: true }));
Products.use(cookieParser(process.env.COOKIE_SECRET));

module.exports = Products;

const { Products_Page } = require("../Page_Controllers/Products.js");

const Check_User = require("../utils/Check_User.js");


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
Products.use(helmet({
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
Products.use(cors(
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




Products.use(bodyParser.json());
Products.use(bodyParser.urlencoded({ extended: true }));
Products.use(cookieParser(process.env.COOKIE_SECRET));

Products.get("/", (req, res) => {
    res.status(304).redirect("/search?Category=All&Latest_Products=true&Search=Latest%20Products");
});
Products.get("/:URL", Check_User , Products_Page );
