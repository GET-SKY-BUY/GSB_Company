require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment_Instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const Verify_Signature = async ( order_id , razorpay_payment_id , Recieved_Signature ) => {
    try {
        const data = order_id + '|' + razorpay_payment_id;
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(data);

        return hmac.digest('hex') === Recieved_Signature;
    } catch (error) {
        return false;
    };
};
module.exports = {
    Verify_Signature,
    Payment_Instance,
};