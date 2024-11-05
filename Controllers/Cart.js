require("dotenv").config();
const { Products , User } = require("../Models.js");



const Add_To_Cart = async ( req , res , next ) => {
    try {

        const Got_User = req.User;
        const Product1 = await Products.findById(req.body.ID.toUpperCase());
                if(Product1){
                    if (Product1.Verified == "Yes") {

                        let Found = false;
                        Product1.Varieties.forEach(element => { 
                            if(element.Quantity >= 0){
                                Found = true;
                                return;
                            };
                        });
                        
                        if(!Found){
                            return res.status(401).json({Message:"Product is out of stock."});
                        };

                        let a = Got_User.Cart;
                        let b = false;
                        for (let index = 0; index < a.length; index++) {
                            const element = a[index];
                            if(element.Product_ID == req.body.ID.toUpperCase()){
                                b = true;
                                break;
                            }
                        }
                        if(!b){
                            a.push({
                                Product_ID: req.body.ID.toUpperCase(),
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

const Buy_Now = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        const Product1 = await Products.findById(req.body.ID.toUpperCase());
        if(Product1){
            if (Product1.Verified == "Yes") {
                
                let Found = false;
                Product1.Varieties.forEach(element => { 
                    if(element.Quantity >= 0){
                        Found = true;
                        return;
                    };
                });
                
                if(!Found){
                    return res.status(401).json({Message:"Product is out of stock."});
                };
                
                const Buy_Now = {
                    Product_ID: req.body.ID.toUpperCase(),
                    Quantity: null,
                    Variety: null,
                    Last_Update: Date.now(),
                };
                await User.updateOne({_id:Got_User._id},{$set:{Buy_Now:Buy_Now}});
                return res.status(200).json({Message:"Redirecting to checkout"});
            
            }else{
                return res.status(401).json({Message:"Product not verified"});
            };
        } else {
            return res.status(404).json({Message:"Product not found"});
        };
    } catch (error) {
        next(error);
    };
};


const Favourite_Add = async ( req , res , next ) => {
    try {

        const Got_User = req.User;
        const Product1 = await Products.findById(req.body.ID.toUpperCase());
                if(Product1){
                    if (Product1.Verified == "Yes") {
                        
                        let a = Got_User.Favourite;
                        let b = false;
                        for (let index = 0; index < a.length; index++) {
                            const element = a[index];
                            if(element.Product_ID == req.body.ID.toUpperCase()){
                                b = true;
                                break;
                            };
                        };
                        if(!b){
                            a.push({
                                Product_ID: req.body.ID.toUpperCase(),
                                Added_On: Date.now(),
                            });
                            await User.updateOne({_id:Got_User._id},{$set:{Favourite:a}});
                            return res.status(200).json({Message:"Added to favourite",});
                        }else{
                            return res.status(401).json({Message:"Already in favourite"});
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
const Favourite_Add_Remove = async ( req , res , next ) => {
    try {

        const Got_User = req.User;
        const Product1 = await Products.findById(req.body.ID.toUpperCase());
                if(Product1){
                    if (Product1.Verified == "Yes") {
                        
                        let a = Got_User.Favourite;
                        let b = false;
                        let ne = [];
                        for (let index = 0; index < a.length; index++) {
                            const element = a[index];
                            if(element.Product_ID == req.body.ID.toUpperCase()){
                                b = true;
                                continue;
                            };
                            ne.push(element);
                        };
                        if(b){
                            await User.updateOne({_id:Got_User._id},{$set:{Favourite:ne}});
                            return res.status(200).json({Message:"Removed from favourite",});
                        }else{
                            return res.status(401).json({Message:"No product found in favourite"});
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
    Buy_Now ,
    Favourite_Add ,
    Favourite_Add_Remove ,
};