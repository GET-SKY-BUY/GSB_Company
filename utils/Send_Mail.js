const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const SMPT_HOST = process.env.SMPT_HOST;
const MAIL_ID = process.env.MAIL_ID;
const ContactNoReply = process.env.ContactNoReply;
const MAIL_PASS = process.env.MAIL_PASS;

let Transporter = nodemailer.createTransport({
    host: SMPT_HOST,
    port: 465,
    secure: true,
    auth: {
        user: MAIL_ID,
        pass: MAIL_PASS
    }
});

let Contact_Us_No_Reply = nodemailer.createTransport({
    host: SMPT_HOST,
    port: 465,
    secure: true,
    auth: {
        user: ContactNoReply,
        pass: MAIL_PASS
    }
});
const Send_Mail = async (MailOptions) => {


    try{
        let info = await Transporter.sendMail(MailOptions);
        if(info){
            return true;
        };
        return false;
    }catch (e){
        return false;
    }
}
const Contact_Us_No_ReplyFunc = async (MailOptions) => {
    try{
        let info = await Contact_Us_No_Reply.sendMail(MailOptions);
        if(info){
            return true;
        };
        return false;
    }catch (e){
        return false;
    };
};
module.exports = {
    Send_Mail,
    Contact_Us_No_Reply: Contact_Us_No_ReplyFunc,
};