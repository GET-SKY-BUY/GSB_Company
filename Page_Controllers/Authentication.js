require('dotenv').config();
const { Verify_Token } = require("../utils/JWT.js");
const { User } = require("../Models.js");

const cookieOptions = {
    domain: process.env.PROJECT_DOMAIN,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 5,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: "strict",
};

const Signup = async ( req, res, next ) => {
    try{
        let User1 = req.signedCookies.User;
        if(!User1) {
            res.clearCookie("User",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            res.cookie("New_User","Yes", cookieOptions);
            return res.status(200).render('signup');
        };

        let Verify = Verify_Token(User1);
        if(!Verify) {
            res.clearCookie("User",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            res.cookie("New_User","Yes",cookieOptions);
            return res.status(200).render('signup');
        };
        
        // Check if the user exists
        await User.findById(Verify.ID).then( user => {
            if (!user) {
                res.clearCookie("User",{
                    domain: process.env.PROJECT_DOMAIN,
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: "strict",
                });
                res.cookie("New_User","Yes",cookieOptions); 
                return res.status(200).render('signup');
            };

            if(!(user.LoggedIn.Token === Verify.Token)) {
                res.clearCookie("User",{
                    domain: process.env.PROJECT_DOMAIN,
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: "strict",
                });
                res.cookie("New_User","Yes",cookieOptions); 
                return res.status(200).render('signup');    
            };

            if(user.Verified === "No") {
                res.clearCookie("User",{
                    domain: process.env.PROJECT_DOMAIN,
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: "strict",
                });
                res.cookie("New_User","Yes",cookieOptions); 
                return res.status(200).render('signup');
            };

            if(user.Ban === "Yes") {
                res.clearCookie("User",{
                    domain: process.env.PROJECT_DOMAIN,
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: "strict",
                });
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