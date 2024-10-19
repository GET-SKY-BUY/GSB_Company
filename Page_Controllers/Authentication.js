require('dotenv').config();
const NODE_ENV = process.env.NODE_ENV;
const { Verify_Token } = require("../utils/JWT.js");
const { User } = require("../Models.js");

const cookieOptions = {
    domain: process.env.PROJECT_DOMAIN,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 5,
    secure: NODE_ENV === 'production',
    signed: true,
    sameSite: "strict",
};

const Signup = async ( req, res, next ) => {
    try{
        if(!req.signedCookies){
            res.cookie("New_User","Yes", cookieOptions); 
            return res.status(200).render('signup');
        };
        let User = req.signedCookies.User;
        if(!User) {
            res.cookie("New_User","Yes", cookieOptions);
            return res.status(200).render('signup');
        };

        let Verify = Verify_Token(User);
        if(!Verify) {
            res.cookie("New_User","Yes",cookieOptions);
            return res.status(200).render('signup');
        };
        
        // Check if the user exists
        await User.findById(Verify.ID).then( user => {
            if (!user) {
                res.cookie("New_User","Yes",cookieOptions); 
                return res.status(200).render('signup');
            };

            if(!(user.LoggedIn.Token === Verify.Token)) {
                res.cookie("New_User","Yes",cookieOptions); 
                return res.status(200).render('signup');    
            };

            if(user.Verified === "No") {
                res.cookie("New_User","Yes",cookieOptions); 
                return res.status(200).render('signup');
            };

            if(user.Ban === "Yes") {
                res.cookie("New_User","Yes",cookieOptions); 
                return res.status(200).render('signup');
            };
            return res.status(307).redirect("/");

        }).catch((err) => {
            next(err);
        });
    }catch (err) {
        next(err)
    };
};
module.exports = {
    Signup,
};