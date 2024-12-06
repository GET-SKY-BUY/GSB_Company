

const { Contact_Us } = require("../Models.js");

const { Contact_Us_No_Reply } = require("../utils/Send_Mail.js");

const Contact_UsA = async ( req , res , next ) => {
    try {

        const Got_User = req.User;

        const {Name, Contact_Number, Whats_App_Number, Gender, Reason } = req.body;
        
        
        if(Name == "" || Name.length < 3){
            return res.status(400).json({
                Message: "Enter a valid name.",
            });
        };
        if(Contact_Number == "" || isNaN(Contact_Number) || Contact_Number.length != 10){
            return res.status(400).json({
                Message: "Enter a valid number.",
            });
        };

        if(Whats_App_Number == "" || isNaN(Whats_App_Number) || Whats_App_Number.length != 10){
            return res.status(400).json({
                Message: "Enter a valid number.",
            });
        };
        if(Gender == ""){
            return res.status(400).json({
                Message: "Enter a valid Gender",
            });
        };
        if(Reason == "" ){
            return res.status(400).json({
                Message: "Please tell us, why do you want to contact us?",
            });
        };
        if(Reason.length < 21){
            return res.status(400).json({
                Message: "Reason for contact must be at least 20 characters.",
            });
        };
        if(Reason.length > 1000){
            return res.status(400).json({
                Message: "Reason for contact must exceed 1000 characters.",
            });
        };

        let Searches = await Contact_Us.find({
            Email: Got_User.Email,
            Solved: false,
        });

        if(Searches.length >= 3){
            return res.status(400).json({
                Message: "You have already contacted us 3 times. Please wait for our response.",
            });
        };

        let New_Contact = new Contact_Us({
            _id: "Con-" + "3" + String(Math.floor(Math.random()*1000) + Date.now()),
            User: Got_User._id,
            Email: Got_User.Email,
            Name: Name,
            Contact_Number: Contact_Number,
            WhatsAppNumber: Whats_App_Number,
            Gender: Gender,
            Reason: Reason,
            Managing_By: {
                ID: "",
                Problem:"",
            },
            Solved: false,
            createdAt: new Date()
        });

        await New_Contact.save().then(data=>{
            let Re = data.Reason.replace(/\n/g, "<br>");
            let Da = new Date(data.createdAt).toDateString();;
            let status = Contact_Us_No_Reply({
                from: "Notification" + "<" + process.env.ContactNoReply + ">",
                to: Got_User.Email,
                subject: "Thank You for Reaching Out to GET SKY BUY!",
                html: `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #eee;
            color: #333;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 0px 3px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #ff8c00;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .Left{
            border: 1px solid #ddd;
            text-align: right;
            padding: 5px;
            width: 25%;
        }
        .Right{
            border: 1px solid #ddd;
            text-align: left;
            padding: 5px;
            width: 75%;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
        }
        @media (max-width: 600px) {
            .email-container {
                padding: 10px;
            }
            table td {
                font-size: 0.9em;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Contact Form Submission</h2>
        <table>
            <tr>
                <td class="Left"><strong>Contact ID:</strong></td>
                <td class="Right">${data._id}</td>
            </tr>
            <tr>
                <td class="Left"><strong>Email:</strong></td>
                <td class="Right">${data.Email}</td>
            </tr>
            <tr>
                <td class="Left"><strong>Name:</strong></td>
                <td class="Right">${data.Name}</td>
            </tr>
            <tr>
                <td class="Left"><strong>Contact Number:</strong></td>
                <td class="Right">${data.Contact_Number}</td>
            </tr>
            <tr>
                <td class="Left"><strong>WhatsApp Number:</strong></td>
                <td class="Right">${data.WhatsAppNumber}</td>
            </tr>
            <tr>
                <td class="Left"><strong>Reason:</strong></td>
                <td class="Right">${Re}</td>
            </tr>
            <tr>
                <td class="Left"><strong>Created On:</strong></td>
                <td class="Right">${Da}</td>
            </tr>
        </table>
        <p>If you want to close this contact or anything else, you can contact to this number via Whats App: <a href="https://wa.me/919332525641">+919332525641</a></p>
        <p>Please do-not reply to this mail, if required, mail us at contact@getskybuy.in with Contact ID number</p>
        
        <div class="footer">
            <p>Thank you for contacting GET SKY BUY. We'll get back to you soon!</p>
        </div>
    </div>
</body>
</html>

                `,
            
            });

            if(!status){
                return res.status(500).json({
                    Message: "Submitted successfully, we will contact you soon. But we are unable to sent you mail.",
                });
            };
            return res.status(200).json({
                Message: "Submitted successfully, we will contact you soon.",
            });



            // Send mail to the user
        });

        


    } catch (error) {
        next(error);
    };
};

module.exports = {
    Contact_Us:Contact_UsA,
}