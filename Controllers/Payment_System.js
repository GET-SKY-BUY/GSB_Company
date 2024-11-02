

const { Get_Payment_By_Id } = require('../Controllers/Payment_Functions.js');

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

module.exports = {
    Payment_Home,
};