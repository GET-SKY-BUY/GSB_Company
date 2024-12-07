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
            return res.status(200).render('Signup');
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
            return res.status(200).render('Signup');
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
                return res.status(200).render('Signup');
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
                return res.status(200).render('Signup');    
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
                return res.status(200).render('Signup');
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
                return res.status(200).render('Signup');
            };
            return res.status(307).redirect("/");

        }).catch((err) => {
            next(err);
        });
    }catch (err) {
        next(err)
    };
};
const Verify_OTP = async ( req, res, next ) => {
    try{
        if(!Verify_Token(req.signedCookies.OTP)) {
            return res.redirect("/auth/signup");
        };
        let User1 = req.signedCookies.User;
        if(!User1) {
            return res.status(200).render('Verify_OTP');
        };

        let Verify = Verify_Token(User1);
        if(!Verify) {
            return res.status(200).render('Verify_OTP');
        };
        
        await User.findById(Verify.ID).then( user => {
            if (!user) {
                return res.status(200).render('Verify_OTP');
            };

            if(!(user.LoggedIn.Token === Verify.Token)) {
                return res.status(200).render('Verify_OTP');    
            };

            if(user.Verified === "No") {
                return res.status(200).render('Verify_OTP');
            };

            if(user.Ban === "Yes") {
                return res.status(200).render('Verify_OTP');
            };
            return res.status(307).redirect("/");

        }).catch((err) => {
            next(err);
        });
    }catch (err) {
        next(err)
    };
};
const Login = async ( req, res, next ) => {
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
            res.cookie("Login_User","Yes", cookieOptions);
            return res.status(200).render('Login');
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
            res.cookie("Login_User","Yes",cookieOptions);
            return res.status(200).render('Login');
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
                res.cookie("Login_User","Yes",cookieOptions); 
                return res.status(200).render('Login');
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
                res.cookie("Login_User","Yes",cookieOptions); 
                return res.status(200).render('Login');    
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
                res.cookie("Login_User","Yes",cookieOptions); 
                return res.status(200).render('Login');
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
                res.cookie("Login_User","Yes",cookieOptions); 
                return res.status(200).render('Login');
            };
            return res.status(307).redirect("/");

        }).catch((err) => {
            next(err);
        });
    }catch (err) {
        next(err)
    };
};

const Forgot_Password = async ( req , res , next ) => {
    try {

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
            return res.status(200).render('Forgot_Password');
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
            return res.status(200).render('Forgot_Password');
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
                return res.status(200).render('Forgot_Password');
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
                return res.status(200).render('Forgot_Password');    
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
                return res.status(200).render('Forgot_Password');
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
                return res.status(200).render('Forgot_Password');
            };
        });

        return res.status(200).redirect("/");

    } catch ( error ) {
        next(error);
    };
};

const Reset_Password = async ( req , res , next ) => {
    try {

        
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
            return res.status(200).render('Reset_Password');
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
            return res.status(200).render('Reset_Password');
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
                return res.status(200).render('Reset_Password');
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
                return res.status(200).render('Reset_Password');    
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
                return res.status(200).render('Reset_Password');
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
                return res.status(200).render('Reset_Password');
            };
        });

        return res.status(200).redirect("/");

    } catch ( error ) {
        next(error);
    };
};

module.exports = {
    Signup,
    Verify_OTP,
    Login,
    Forgot_Password,
    Reset_Password,

};