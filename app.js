"use strict";
// Importing the required modules
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const pug = require('pug');

// Initialize the express app
const app = express();
dotenv.config();

// Environment variables
const PORT = process.env.PORT;
const Cookie_Secret = process.env.COOKIE_SECRET;


// Set the view engine to pug
app.set('view engine', 'pug');
app.set('views', [
    path.join(__dirname, './Pug/Auth'),
    path.join(__dirname, './Pug/Common'),
    path.join(__dirname, './Pug/Profile'),
    path.join(__dirname, './Pug/Product'),
    path.join(__dirname, './Pug/Checkout'),
]);


// Protocol 
let Protocol = "http";
if (process.env.NODE_ENV === 'production') {
    Protocol = 'https';
};
// Project URL
const Project_URL = `${Protocol}://${process.env.PROJECT_DOMAIN}`;

// Setup static folder
app.use("/verified/files", express.static(path.join(__dirname, './Public')));
app.use("/product/files/image", express.static(path.join(__dirname, '../GSB_Admin/Converted_Images')));

// Routes for the APIs
app.use("/api/v1/auth", require('./Routes/User_Authentication.js'));
app.use("/api/v1/profile", require('./Routes/Profile.js'));
app.use("/api/v1/additional", require('./Routes/Additional.js'));
app.use("/api/v1/product", require('./Routes/Product.js'));
app.use("/api/v1/cart", require('./Routes/Cart.js'));
app.use("/api/v1/checkout", require('./Routes/Checkout.js'));
app.use("/api/v1/control/", require('./Routes/Control.js'));

//--------------------------------------------------------------

// Pages
app.use("/auth", require('./Page_Routes/Authentication.js'));
app.use("/profile", require('./Page_Routes/Profile.js'));
app.use("/products", require('./Page_Routes/Products.js'));
app.use("/Checkout", require('./Page_Routes/Checkout.js'));

//--------------------------------------------------------------

//--------------------------------------------------------------

// Setup body-parser middleware for parsing JSON
app.use(bodyParser.json()); // parse application/json

// Setup body-parser middleware for parsing URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser middleware for parsing cookies
app.use(cookieParser(Cookie_Secret));

// Helmet middleware for securing the app
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'" , Project_URL],
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
app.use(cors(
    {
        origin: [
            Project_URL,
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


app.use((req, res, next) => {
    // res.removeHeader("X-Robots-Tag");
    res.set('X-Robots-Tag', 'index, follow'); 
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    const File_Path = path.join(__dirname, './Logs', 'error.log');
    fs.appendFile( File_Path, err.stack , (err) => {
        if (err) {
            console.error(err.stack);
        };
    });
    return res.status(500).json({
        Status: "Error",
        Message: "Something happened. Please try again later.",
        Error_Type: "Internal Server Error.",
    });
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nDisallow: /checkout\nDisallow: /api/v1\nDisallow: /api/v1/auth\nDisallow: /api/v1/profile\nDisallow: /api/v1/additional\nDisallow: /api/v1/product\nDisallow: /api/v1/cart`);
});

const Check_User = require("./utils/Check_User.js");
app.get("/", Check_User ,require("./Links/Home.js"))
app.get("/search", Check_User , require("./Links/Search.js") )
app.get("/contact_us" , Check_User , require("./Links/Contact_Us.js"));
app.get("/privacy_and_policy" , (req, res) => {
    let a = path.join(__dirname, "./Company/Privacy and policy - GET SKY BUY.pdf");
    return res.sendFile(a);
} )
app.get("/terms_and_conditions" , (req, res) => {
    let a = path.join(__dirname, "./Company/Terms and condition - GET SKY BUY.pdf");
    return res.sendFile(a);
} )
app.get("/about_us" , (req, res) => {
    return res.status(200).render("About_Us");
} )
app.get("/help_center" , (req, res) => {
    return res.status(200).send("Coming soon <a href='/'>Go to home</a>");
} )
app.get("/download_app" , (req, res) => {
    return res.status(200).send("Coming soon <a href='/'>Go to home</a>");
} )
app.get("/improve_us" , (req, res) => {
    return res.status(200).send("Coming soon <a href='/'>Go to home</a>");
} )
app.get("/file_a_complaint" , (req, res) => {
    return res.status(200).send("Coming soon <a href='/'>Go to home</a>");
} )
app.get("/report_a_problem" , (req, res) => {
    return res.status(200).send("Coming soon <a href='/'>Go to home</a>");
} )
app.get("/customer_care" , (req, res) => {
    return res.status(200).send("Coming soon <a href='/'>Go to home</a>");
});
// Download app
// Contact us
// Improve us
// Customer care
// Terms and conditions
// File a complaint
// Report a problem
// Shop - stores


app.get("*", (req, res, next)=>{
    return res.status(404).render("404");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server link: ${Project_URL}`);
});