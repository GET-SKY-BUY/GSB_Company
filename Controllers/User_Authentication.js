require("dotenv").config();
const { Signup_User } = require("../utils/Zod_Schema.js");
const { User } = require("../Models.js");
const { Valid_Email, Valid_Password , Valid_Mobile} = require("../utils/Validations.js");
const Send_Mail = require("../utils/Send_Mail.js");
const { Verify_Token , Generate_Token }= require("../utils/JWT.js");
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

const { Password_Hash, Password_Compare } = require("../utils/Password.js");
const { Get_Token , Get_OTP } = require("../utils/Auth.js");


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
            LoggedIn:[],
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
                subject: "OTP Verification",
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
module.exports = {
    Signup,
    Verify_OTP,
    OTP_Resend,
};