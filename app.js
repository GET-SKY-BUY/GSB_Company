"use strict";
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
dotenv.config();
const PORT = process.env.PORT;

let Protocol = "http";
if (process.env.NODE_ENV === 'production') {
    Protocol = 'https';
};

// Project URL
const Project_URL = `${Protocol}://${process.env.PROJECT_DOMAIN}`;

// Setup static folder
app.use(express.static(path.join(__dirname, './Public')));

// Routes

// Setup cors
app.use(cors(
    {
        origin: [
            Project_URL,
            "http://localhost:80",
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

// Setup body-parser middleware for parsing JSON
app.use(bodyParser.json()); // parse application/json

// Setup body-parser middleware for parsing URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser middleware for parsing cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Helmet middleware for securing the app
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"], 
            StyleSheetListSrc: ["'self'", "fonts.googleapis.com"], // Allow stylesheets
            imgSrc: ["'self'", "data:"], // Allow images from self and data URIs
            connectSrc: ["'self'", Project_URL], // Allow connections to this API
            frameSrc: ["'none'"], // Prevent embedding in frames
            objectSrc: ["'none'"], // Prevent loading plugins
            // reportUri: "/csp-violation-report-endpoint" // Report violations to this endpoint
        }
    },
    frameguard: { action: 'deny' }, // Prevent clickjacking by denying framing
    hsts: { maxAge: 31536000 }, // Enforce HTTPS for 1 year
    xssFilter: true, // Enable XSS filter in browsers
    noSniff: true, // Prevent MIME sniffing
}));


// Error handling middleware
app.use((err, req, res, next) => {
    const File_Path = path.join(__dirname, 'logs', './error.log');
    fs.appendFile(File_Path, err, (err) => {
        if (err) {
            console.error(err.stack);
        };
    });
    res.status(500).json({
        Status: "Error",
        Message: "Something went wrong, please try again later",
        Error_Type: "Internal Server Error.",
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        Status: "Success",
        Message: "Server is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server link: ${Project_URL}`);
});