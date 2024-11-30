

const { Get_Categories , Get_Categories_Option } = require("../utils/Categories.js");

const Contact_Us = async ( req , res , next) => {
    try {
        if(!req.User){
            return res.status(200).render("Contact_Us",{
                Get_Categories_Option : await Get_Categories_Option(next),
                CartNumber:0,
                Login: `<a title="Login" href="/auth/login">Login</a>`,
                Logout:"",
            });
        };
        return res.status(200).render("Contact_Us",{
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:req.User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (error) {
        next(error);
    };
};

module.exports = Contact_Us;