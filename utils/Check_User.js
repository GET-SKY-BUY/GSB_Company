const { Verify_Token } = require("./JWT.js");
const { User } = require("../Models.js");
const Check_User = async ( req, res, next) => {
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
            return next();
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
            return next();
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
                return next();
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
                return next();   
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
                return next();
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
                return next();
            };

            req.User = user;
            next();
        }).catch((err) => {
            next(err);
        });
    } catch (err) {
        next(err);
    };
};
module.exports = Check_User;