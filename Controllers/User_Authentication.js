require("dotenv").config();
const { Signup_User } = require("../utils/Zod_Schema.js");
const { User } = require("../Models.js");
const { Valid_Email, Valid_Password , Valid_Mobile} = require("../utils/Validations.js");
const Send_Mail = require("../utils/Send_Mail.js");
const { Generate_Token }= require("../utils/JWT.js");


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
                Message: "Unauthorized access - Verify your account."
            });
        }


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
        
        let Hashed_Password = await Password_Hash(Parse.Password);
        let Save_Token = await Get_Token();
        let OTP = await Get_OTP();
        let OTP_Expiry = Number(Date.now() + (5 * 1000)); // 5 minutes
        
        let New_User = {
            _id: "123",
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
            return res.status(500).json({
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
            res.clearCookie("New_User",{path:"/"});
            return res.status(201).cookie("OTP",JWT_TOKEN,Cookie_Options_OTP).json({Status: "Success", Message: "OTP sent successfully."});
        }).catch(err => { next(err) });
    }catch (err) {
        next(err)
    };
};
module.exports = {
    Signup,
}