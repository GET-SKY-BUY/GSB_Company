const { Verify_Token } = require("./JWT.js");
const { User } = require("../Models.js");
const Verify_User = async ( req, res, next) => {
    try {
        
        let User = req.signedCookies.User;
        if(!User) {
            // Redirect to login with status code
            return res.status(401).clearCookie("User",{path:"/"}).redirect("/api/v1/auth/login");
        };

        let Verify = Verify_Token(User);
        if(!Verify) {
            // Redirect to login with status code
            return res.status(401).clearCookie("User",{path:"/"}).redirect("/api/v1/auth/login");
        };
        
        // Check if the user exists
        await User.findById(Verify.ID).then( user => {
            if (!user) {
                return res.status(401).clearCookie("User",{path:"/"}).redirect("/api/v1/auth/login");
            };

            if(user.Verified === "No") {
                return res.status(401).clearCookie("User",{path:"/"}).redirect("/api/v1/auth/login");
            };

            if(user.Ban === "Yes") {
                return res.status(401).clearCookie("User",{path:"/"}).redirect("/api/v1/auth/login");
            };

            req.User = user;
            next();
        }).catch((err) => {
            next(err);
        });
    } catch (err) {
        next(err);
    };
}
module.exports = Verify_User;