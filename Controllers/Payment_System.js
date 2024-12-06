

const { Get_Payment_By_Id , Create_Order_Id , Verify_Signature } = require('../Controllers/Payment_Functions.js');

const Payment_Home = async ( req , res , next ) => {
    try {

        const Payment = await Get_Payment_By_Id( req.body.Payment_ID );
        return res.status(200).json({
            Status: "Success",
            Message: "Payment Successful",
            Payment: Payment,
        });
    } catch (error) {
        next(error);
    };
};

const Payment_Create_Order = async ( req , res , next ) => {
    try {

        const Order_ID = await Create_Order_Id( req.body.Order_Details );



        var options = {
            "key": process.env.RAZORPAY_KEY_ID,
            "amount": String(req.body.Order_Details.amount * 100),
            "currency": "INR",
            "name": "Acme Corp",
            "description": "Test Transaction",
            "image": "/verified/files/images/GSB-Full-Logo.webp",
            "order_id": Order_ID.id,
            
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#ff914d"
            }
        };
        
        return res.status(200).json({
            Status: "Success",
            Message: "Payment Successful",
            Order_ID: options,
        });
    } catch (error) {
        next(error);
    };
};

const Verify_Payment_Signature = async ( req , res , next ) => {
    try {

        const Signature_Verified = await Verify_Signature( req.body.order_id , req.body.razorpay_payment_id , req.body.signature );
        return res.status(200).json({
            Status: "Success",
            Message: "Payment Signature Verified",
            Signature_Verified: Signature_Verified,
        });

    } catch (error) {
        next(error);
    };
};

module.exports = {
    Payment_Home,
    Payment_Create_Order,
    Verify_Payment_Signature
};