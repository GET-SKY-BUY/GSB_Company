require("dotenv").config();
const Razorpay = require("razorpay");
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

module.exports = {
    Get_Payment_By_Id,
    Create_Order_Id,
    
};