require("dotenv").config();

const { Products } = require("../Models.js");

const Checkout_Cart = async ( req , res , next ) => {
    try {
        const Got_User = req.User;

        const Options = {
            
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        }

        return res.status(200).render("Checkout_Cart", Options);
    }catch (error) {
        next(error);
    };
};

module.exports = {
    Checkout_Cart,
}