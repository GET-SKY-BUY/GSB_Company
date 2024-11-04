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

Products.get("/", (req, res) => {
    res.status(304).redirect("/search?Category=All&Latest_Products=true&Search=Latest%20Products");
});
Products.get("/:URL", Check_User , Products_Page );
