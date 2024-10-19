"use strict";
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).json({
        Status: "Success",
        Message: "Server is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    let Protocol = "http";
    if (process.env.NODE_ENV === 'production') {
        Protocol = 'https';
    };
    console.log(`Server link: ${Protocol}://${process.env.PROJECT_DOMAIN}`);
});