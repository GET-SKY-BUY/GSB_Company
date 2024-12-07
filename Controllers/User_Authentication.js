require("dotenv").config();
const { Signup_User , Login_User , Change_Password_User } = require("../utils/Zod_Schema.js");
const { User } = require("../Models.js");
const { Valid_Email, Valid_Password , Valid_Mobile} = require("../utils/Validations.js");
const { Verify_Token , Generate_Token }= require("../utils/JWT.js");
const { Password_Hash, Password_Compare } = require("../utils/Password.js");
const { Get_Token , Get_OTP } = require("../utils/Auth.js");
const { Send_Mail } = require("../utils/Send_Mail.js");
const Profile_ID = require("../utils/Profile_ID.js");

const Cookie_Options_OTP = {
    domain: process.env.PROJECT_DOMAIN,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 5,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: "strict",
};
const Cookie_Options_User = {
    domain: process.env.PROJECT_DOMAIN,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30 * 2,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: "strict",
};



const Signup = async ( req, res, next ) => {
    
    try{
        
        let User1 = req.signedCookies.User;
        let VER = false;
        if(!User1) {
            VER = true;
            
        };

        let Verify = Verify_Token(User1);
        if(!Verify && !VER){
            VER = true;
        };
        
        if(!VER){

            await User.findById(Verify.ID).then( user => {
                if (!user) {
                    VER = true;
                };
                
                if(!(user.LoggedIn.Token === Verify.Token)) {
                    VER = true;
                };
                
                if(user.Verified === "No") {
                    VER = true;
                };
                
                if(user.Ban === "Yes") {
                    VER = true;
                };
                
            });
        };

        if(!VER){
            return res.redirect("/");
        };
        res.clearCookie("User",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });

        let New_Token = req.signedCookies.New_User;
        if(!New_Token){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };

        if(!(New_Token === "Yes")){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };


        let Parse = Signup_User.safeParse(req.body);

        if(!Parse.success){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data.",
            });
        };

        Parse = Parse.data;
        Parse.Email = Parse.Email.toLowerCase();
        if(!(Valid_Email(Parse.Email) && Valid_Password(Parse.Password) && Valid_Mobile(Parse.Mobile_Number))){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };
        let Found = await User.findOne({Email: Parse.Email});
        if(Found){
            return res.status(400).json({
                Status: "Failed",
                Message: "You already have an account."
            });
        };

        let P_ID;
        let Userss = await User.find({});
        while(true){
            let Check = true;
            P_ID = Profile_ID();
            for (let i = 0; i < Userss.length; i++) {
                const element = Userss[i];
                if(element._id === P_ID){
                    Check = false;
                    break;
                };
            }
            if(Check){
                break;
            };
        };
        
        let Hashed_Password = await Password_Hash(Parse.Password);
        let Save_Token = await Get_Token();
        let OTP = await Get_OTP();
        let OTP_Expiry = Number(Date.now() + (5 * 1000)); // 5 minutes
        
        let New_User = {
            _id: P_ID,
            Personal_Data:{
                First_Name: Parse.First_Name,
                Last_Name: Parse.Last_Name,
                Mobile_Number: Parse.Mobile_Number,
                DOB: Parse.DOB,
                Gender: Parse.Gender,
            },
            Password: Hashed_Password,
            Email: Parse.Email,
            Ban: "No",
            Verified: "No",
            createdAt: new Date(),
            Auth:{
                OTP: OTP,
                OTP_Expiry: OTP_Expiry,
                Token: Save_Token,
            },
            LoggedIn:{
                Token: "",
                Created: new Date(),
            },
            Cart:[],
            Buy_Now:[],
            Orders:[],
            Address:{
                Active_ID:"",
                List:[],
            },
            Search_History:[],
            Product_History:[],
            Interested_Search:[],
            GSBCoins:{
                Available:0,
                Earned:0,
                History:[],
            },
            Favourite:[],
            Wishlist:[],
            Notification:[],
            Bank:{
                Bank_Name:"",
                Beneficiary_Name:"",
                Account_Number:"",
                IFSC_Code:"",
            },
            Refund:[],
            Overview:[],
        }

        let Status = await Send_Mail({
            from: "OTP - GSB" + "<" + process.env.MAIL_ID + ">",
            to: New_User.Email,
            subject: "OTP Verification",
            html: `Hello ${New_User.Personal_Data.First_Name}, <br>Your OTP is ${OTP}. <br><br>It is valid for 5 minutes.`,
        });
        
        if(!Status){
            return res.status(400).json({
                Status: "Failed",
                Message: "Unable to sent OTP."
            });

        };

        const JWT_TOKEN = Generate_Token({
            ID: New_User._id,
            Token: Save_Token
        });

        let Save = new User(New_User);
        await Save.save().then(()=>{
            res.clearCookie("New_User",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            return res.status(201).cookie("OTP",JWT_TOKEN,Cookie_Options_OTP).json({Status: "Success", Message: "OTP sent successfully."});
        }).catch(err => { next(err) });
    }catch (err) {
        next(err)
    };
};



const Verify_OTP = async (req, res, next) => {
    try {
        let O = req.signedCookies.OTP;
        if(!O){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };
        let Verify = Verify_Token(O);
        if(!Verify){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };


        let Got_Token = Verify.Token;
        let Got_ID = Verify.ID;
        let Got = req.body.OTP;

        if(!Got || !Got_Token || !Got_ID ){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };

        if(Got.length !== 6){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };

        let Search = await User.findById(Got_ID);
        if(!Search){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };

        if (Search.Auth.OTP_Expiry > Date.now()){
            return res.status(400).json({Status: "Failed", Message: "Your OTP is expired."});
        };

        if(Search.Auth.Token !== Got_Token){
            return res.status(400).json({Status: "Failed", Message: "Invalid Token."});
        };

        if(Search.Auth.OTP === Got){
            Search.Verified = "Yes";
            Search.Auth.OTP = "";
            Search.Auth.OTP_Expiry = 0;
            Search.Auth.Token = "";
            await Search.save();
            res.clearCookie("OTP",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            return res.status(200).json({Status: "Success", Message: "OTP verified successfully."});        
        };
        
        return res.status(400).json({Status: "Failed", Message: "Invalid OTP."});
        
        
    } catch (error) {
        next(error);
    };
};


const OTP_Resend = async (req, res, next) => {
    try {
        let O = req.signedCookies.OTP;
        if(!O){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };
        let Verify = Verify_Token(O);
        if(!Verify){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };


        let Got_Token = Verify.Token;
        let Got_ID = Verify.ID;
        let Got = req.body.Sent;
        if (Got !== "Yes"){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        }
        if(!Got_Token || !Got_ID ){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };

        let Search = await User.findById(Got_ID);
        if(!Search){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };

        if(Search.Auth.Token !== Got_Token){
            return res.status(400).json({Status: "Failed", Message: "Invalid Token."});
        };

        if (Search.Auth.OTP_Expiry > Date.now()){
            return res.status(400).json({Status: "Failed", Message: "Your OTP is expired."});
        };


        let x = new Date(Search.Auth.OTP_Expiry)
        const DatabaseTime = x.getTime()
        const Time = (Date.now() - DatabaseTime);
        if( Time > 90 * 1000){
            let Save_Token = await Get_Token();
            let OTP = await Get_OTP();
            let OTP_Expiry = Number(Date.now() + (5 * 1000));
            Search.Auth.OTP = OTP;
            Search.Auth.OTP_Expiry = OTP_Expiry;
            Search.Auth.Token = Save_Token;
            let Status = await Send_Mail({
                from: "OTP - GSB" + "<" + process.env.MAIL_ID + ">",
                to: Search.Email,
                subject: "Resent - OTP Verification",
                html: `Hello ${Search.Personal_Data.First_Name}, <br>Your OTP is ${OTP}. <br><br>It is valid for 5 minutes.`,
            });
            if(!Status){
                return res.status(400).json({
                    Status: "Failed",
                    Message: "Unable to sent OTP."
                });
            };
            
            const JWT_TOKEN = Generate_Token({
                ID: Search._id,
                Token: Save_Token
            });
            res.cookie("OTP",JWT_TOKEN,Cookie_Options_OTP)
            await Search.save();
            return res.status(200).json({Status: "Success", Message: "Resent OTP successfully."});        
        };
        return res.status(400).json({Status: "Failed", Message: "Wait for timer (After " + (90 - Math.floor(Time/1000)) + " Seconds)"});
        
        
    } catch (error) {
        next(error);
    };
};



const Login = async ( req, res, next ) => {
    
    try{
        
        let User1 = req.signedCookies.User;
        let VER = false;
        if(!User1) {
            VER = true;
            
        };

        let Verify = Verify_Token(User1);
        if(!Verify && !VER){
            VER = true;
        };
        
        if(!VER){

            await User.findById(Verify.ID).then( user => {
                if (!user) {
                    VER = true;
                };
                
                if(!(user.LoggedIn.Token === Verify.Token)) {
                    VER = true;
                };
                
                if(user.Verified === "No") {
                    VER = true;
                };
                
                if(user.Ban === "Yes") {
                    VER = true;
                };
                
            });
        };

        if(!VER){
            return res.redirect("/");
        };
        res.clearCookie("User",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        let New_Token = req.signedCookies.Login_User;
        if(!New_Token){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };

        if(!(New_Token === "Yes")){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };

        let Parse = Login_User.safeParse(req.body);

        if(!Parse.success){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data.",
            });
        };

        Parse = Parse.data;
        Parse.Email = Parse.Email.toLowerCase();
        if(!(Valid_Email(Parse.Email) && Valid_Password(Parse.Password))){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };
        let Found = await User.findOne({Email: Parse.Email});
        if(!Found){
            return res.status(400).json({
                Status: "Failed",
                Message: "You don't have an account."
            });
        };
        const Match_Password = await Password_Compare(Parse.Password, Found.Password);
        if(!Match_Password){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid password."
            });
        };

        if(Found.Verified === "No"){
            let Save_Token = await Get_Token();
            let OTP = await Get_OTP();
            let OTP_Expiry = Number(Date.now() + (5 * 1000));
            
            let Status = await Send_Mail({
                from: "OTP - GSB" + "<" + process.env.MAIL_ID + ">",
                to: Found.Email,
                subject: "OTP Verification",
                html: `Hello ${Found.Personal_Data.First_Name}, <br>Your OTP is ${OTP}. <br><br>It is valid for 5 minutes.`,
            });
            
            if(!Status){
                return res.status(400).json({
                    Status: "Failed",
                    Message: "Unable to sent OTP."
                });
            };
            Found.Auth.OTP = OTP;
            Found.Auth.OTP_Expiry = OTP_Expiry;
            Found.Auth.Token = Save_Token;
            const JWT_TOKEN = Generate_Token({
                ID: Found._id,
                Token: Save_Token
            });
            await Found.save().then(()=>{
                res.clearCookie("Login_User",{
                    domain: process.env.PROJECT_DOMAIN,
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: "strict",
                });
                return res.status(201).cookie("OTP",JWT_TOKEN,Cookie_Options_OTP).json({Status: "Success", Message: "Account not verified, OTP sent successfully."});
            }).catch(err => { next(err) });

        }else{

            let Save_Token = await Get_Token();
            Found.LoggedIn.Token = Save_Token;
            Found.LoggedIn.Created = new Date();

            const JWT_TOKEN = Generate_Token({
                ID: Found._id,
                Token: Save_Token
            });
            
            await Found.save().then(async ()=>{
                let Status = await Send_Mail({
                    from: "Login - GSB" + "<" + process.env.MAIL_ID + ">",
                    to: Found.Email,
                    subject: "Login Successful notification",
                    html: `Hello ${Found.Personal_Data.First_Name}, <br>You have been logged in to your account, if not done by you please change your password immediately.`,
                });
                if(!Status){
                    return res.status(400).json({
                        Status: "Failed",
                        Message: "Unable to sent OTP."
                    });
                };
                
                res.clearCookie("Login_User",{
                    domain: process.env.PROJECT_DOMAIN,
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: "strict",
                });
                return res.status(201).cookie("User",JWT_TOKEN,Cookie_Options_User).json({Status: "Success", Message: "Login successfully."});
            }).catch(err => { next(err) });
        }
    }catch (err) {
        next(err)
    };
};

const Change_Password = async (req, res, next) => {
    try{
        const Got_User = req.User;
        let Parse = Change_Password_User.safeParse(req.body);
        if(!Parse.success){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };
        Parse = Parse.data;
        if(!(Valid_Password(Parse.Current_Password) && Valid_Password(Parse.New_Password))){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };
        const Match_Password = await Password_Compare(Parse.Current_Password, Got_User.Password);
        if(!Match_Password){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid password."
            });
        };
        let Hashed_Password = await Password_Hash(Parse.New_Password);
        Got_User.Password = Hashed_Password;
        await Got_User.save().then( async ()=>{
            
            let Status = await Send_Mail({
                from: "Password alert" + "<" + process.env.MAIL_ID + ">",
                to: Got_User.Email,
                subject: "Password changed",
                html: `Hello ${Got_User.Personal_Data.First_Name}, <br>Your password changed successful, if not done by you please immediately change your password.`,
            });
            if(!Status){
                return res.status(400).json({
                    Status: "Failed",
                    Message: "Password changed successfully, but unable to sent OTP."
                });
            };
            return res.status(200).json({
                Status: "Success",
                Message: "Password changed successfully."
            });
        });
    }catch(err){
        next(err);
    };
};

const Forgot_Password = async ( req , res , next ) => {
    try {
        const Email = req.body.Email;

        if(!Email){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };

        if(!Valid_Email(Email)){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid data."
            });
        };

        let Found = await User.findOne({Email: Email});

        if(!Found){
            return res.status(400).json({
                Status: "Failed",
                Message: "You don't have an account."
            });
        };

        let Save_Token = await Get_Token();
        let OTP = await Get_OTP();

        let OTP_Expiry = new Date(Number(Date.now() + (5* 60* 1000))); 

        Found.Auth.OTP = OTP;
        Found.Auth.OTP_Expiry = OTP_Expiry;
        Found.Auth.Token = Save_Token;

        let Status = await Send_Mail({
            from: "Forgot Password - GSB" + "<" + process.env.MAIL_ID + ">",
            to: Found.Email,
            subject: "Forgot Password - GET SKY BUY",
            html: `Hello ${Found.Personal_Data.First_Name}, <br>Your OTP is ${OTP}. <br><br>It is valid for 5 minutes.`,
        });

        if(!Status){
            return res.status(400).json({
                Status: "Failed",
                Message: "Unable to sent OTP."
            });
        };
        
        const JWT_TOKEN = Generate_Token({
            ID: Found._id,
            Token: Save_Token
        });

        await Found.save().then(()=>{
            return res.status(201).cookie("OTP_TOKEN",JWT_TOKEN,Cookie_Options_OTP).json({Status: "Success", Message: "OTP sent successfully."});
        });

    } catch ( error ) {
        next(error);
    };
};

const Reset_Password = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies["OTP_TOKEN"];
        const OTP  = req.body.OTP;
        const New_Password = req.body.New_Password;

        const Verify_To = Verify_Token(Token);

        if(!Verify_To){
            return res.status(400).json({
                Status: "Failed",
                Message: "Unauthorized"
            });
        };

        let User_Found = await User.findById(Verify_To.ID);

        if(!User_Found){
            return res.status(400).json({
                Status: "Failed",
                Message: "No user found."
            });
        };

        if(!OTP){
            return res.status(400).json({
                Status: "Failed",
                Message: "OTP not found."
            });
        };

        if(parseInt(OTP,10) == NaN){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP."
            });
        };

        if(OTP.length != 6){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP."
            });
        };

        if(User_Found.Auth.Token != Verify_To.Token){
            return res.status(400).json({
                Status: "Failed",
                Message: "Unauthorized access"
            });
        };

        if(User_Found.Auth.OTP_Expiry < new Date()){
            return res.status(400).json({
                Status: "Failed",
                Message: "OTP expired."
            })
        };

        if(User_Found.Auth.OTP != OTP){
            return res.status(400).json({
                Status: "Failed",
                Message: "Incorrect OTP"
            });
        };
        
        if(!Valid_Password(New_Password)){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid password, password must be contain atleast 8 character and combination of numbers and alphabets."
            });    
        };

        const NewSave_Pass = await Password_Hash(New_Password);
        
        User_Found.Password = NewSave_Pass;
        User_Found.Auth.OTP = "";
        User_Found.Auth.OTP_Expiry = new Date();
        User_Found.Auth.Token = "";

        await User_Found.save();
                
        let Status = await Send_Mail({
            from: "Password changed" + "<" + process.env.MAIL_ID + ">",
            to: User_Found.Email,
            subject: "Password change - GET SKY BUY",
            html: `Hello ${User_Found.Personal_Data.First_Name}, <br>Your password has been changed, if not done by you please change your password`,
        });

        if(!Status){
            return res.status(201).clearCookie("OTP_TOKEN",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            }).json({
                Status: "Partially completed",
                Message: "Password changed but unable to sent confirmation mail."
            })
        };

        return res.status(201).clearCookie("OTP_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        }).json({
            Status: "Success",
            Message: "Password changed successfully."
        });

    } catch ( error ) {
        next(error);
    };
};

const Logout = async ( req , res , next ) => {
    try {

        res.clearCookie("User",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });

        return res.status(307).redirect("/auth/login");

    } catch ( error ) {
        next(error);
    }
};



module.exports = {
    Signup,
    Verify_OTP,
    OTP_Resend,
    Login,
    Change_Password,
    Forgot_Password,
    Reset_Password,
    Logout,
};