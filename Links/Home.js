

const { Get_Categories , Get_Categories_Option } = require("../utils/Categories.js");

const Home = async (req, res, next) => {
    try {

        if(req.User){
            res.status(200).render('Home', {
                Get_Categories_Option : await Get_Categories_Option(next),
                CartNumber:req.User.Cart.length,
                Login:"",
                Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
                
            });
            
        }else{
            res.status(200).render('Home', {
                Get_Categories_Option : await Get_Categories_Option(next),
                CartNumber:0,
                Logout:"",
                Login: `<a title="Login" href="/auth/login">Login</a>`,
            });
        }
    }catch (err) {
        next(err);
    };
};
module.exports = Home;