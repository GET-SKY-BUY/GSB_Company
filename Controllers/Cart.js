require("dotenv").config();
const { Products , User } = require("../Models.js");



const Add_To_Cart = async ( req , res , next ) => {
    try {

        const Got_User = req.User;
        const Product1 = await Products.findById(req.body.ID.toUpperCase());
                if(Product1){
                    if (Product1.Verified == "Yes") {
                        
                        let a = Got_User.Cart;
                        let b = false;
                        for (let index = 0; index < a.length; index++) {
                            const element = a[index];
                            if(element.Product_ID == req.body.ID){
                                b = true;
                                break;
                            }
                        }
                        if(!b){
                            a.push({
                                Product_ID: req.body.ID,
                                Quantity: null,
                                Variety: null,
                                Last_Update: Date.now(),
                            });


                            await User.updateOne({_id:Got_User._id},{$set:{Cart:a}});
                            return res.status(200).json({Message:"Product added to cart", Len:a.length});
                        }else{
                            return res.status(401).json({Message:"Product already in cart"});
                        };
                    }else{
                        return res.status(401).json({Message:"Product not verified"});
                    };
                }else{
                    return res.status(404).json({Message:"Product not found"});
                };
    } catch (error) {
        next(error);
    };
};
module.exports = {
    Add_To_Cart ,
};