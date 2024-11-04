require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment_Instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const Get_Payment_By_Id = async ( ID ) => {
    try {
        const Payment = await Payment_Instance.payments.fetch( ID );
        return Payment;
    } catch (error) {
        return null;
    };
};

const Create_Order_Id = async ( Order_Details ) => {
    try {
        const Order = await Payment_Instance.orders.create( Order_Details );
        return Order;
    } catch (error) {
        return null;
    };
};

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
    Get_Payment_By_Id,
    Create_Order_Id,
    Verify_Signature,

};