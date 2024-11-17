require("dotenv").config();
const { Products , User } = require("../Models.js");



const Add_To_Cart = async ( req , res , next ) => {
    try {

        const Got_User = req.User;
        const Product1 = await Products.findById(req.body.ID.toUpperCase());
                if(Product1){
                    if (Product1.Verified == "Yes") {

                        let Found = true;
                        let Var_T;
                        for (let index = 0; index < Product1.Varieties.length; index++) {
                            const element = Product1.Varieties[index];
                            if(element.Quantity > 0){
                                Found = true;
                                Var_T = element.Type;
                                break;
                            };
                        };
                        
                        if(!Found){
                            return res.status(401).json({Message:"Product is out of stock."});
                        };

                        let a = Got_User.Cart;
                        
                        a.push({
                            Product_ID: req.body.ID.toUpperCase(),
                            Quantity: 1,
                            Variety: Var_T,
                            ID: Date.now(),
                        });
                        
                        await User.updateOne({_id:Got_User._id},{$set:{Cart:a}});
                        return res.status(200).json({Message:"Product added to cart", Len:a.length});
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
                let Var_T;

                for (let index = 0; index < Product1.Varieties.length; index++) {
                    const element = Product1.Varieties[index];
                    if(element.Quantity > 0){
                        Found = true;
                        Var_T = element.Type;
                        break;
                    };
                };
                if(!Found){
                    return res.status(401).json({Message:"Product is out of stock."});
                };
                
                const Buy_Now = {
                    Product_ID: req.body.ID.toUpperCase(),
                    Quantity: 1,
                    Variety: Var_T,
                    ID: String(Date.now()),
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

const Cart_Remove_Product = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        let a = Got_User.Cart;
        let b = false;
        let ne = [];
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            if(element.ID == req.body.ID){
                b = true;
                continue;
            };
            ne.push(element);
        };
        if(b){
            await User.updateOne({_id:Got_User._id},{$set:{Cart:ne}});
            return res.status(200).json({Message:"Removed from cart",N: ne.length});
        } else{
            return res.status(401).json({Message:"No product found in cart"});
        };

    } catch (error) {
        next(error);
    };
};

const Cart_Update_Option = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        let a = Got_User.Cart;
        let b = false;
        let ne = [];
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            if(element.ID == req.body.ID){
                b = true;

                let hg = await Products.findById(element.Product_ID);
                let Found = false;
                for (let i = 0; i < hg.Varieties.length; i++) {
                    const element1 = hg.Varieties[i];
                    if(element1.Type == req.body.Option){
                        Found = true;
                        break;
                    };
                };
                if(!Found){
                    return res.status(401).json({Message:"Option not found"});
                };
                
                element.Variety = req.body.Option;
            };
            ne.push(element);
        };
        if(b){
            await User.updateOne({_id:Got_User._id},{$set:{Cart:ne}});
            return res.status(200).json({Message:"Updated cart option"});
        } else{
            return res.status(401).json({Message:"No product found in cart"});
        };
    } catch (error) {
        next(error);
    };
};

const Cart_Update_Quantity = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        let a = Got_User.Cart;
        let b = false;
        let ne = [];
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            if(element.ID == req.body.ID){

                let hg = await Products.findById(element.Product_ID);
                let Found = false;
                for (let i = 0; i < hg.Varieties.length; i++) {
                    const element1 = hg.Varieties[i];
                    if(element1.Type == element.Variety){
                        if(element1.Quantity < Number(req.body.Quantity)){
                            return res.status(401).json({Message:"Quantity not available"});
                        };
                        Found = true;
                        break;
                    };
                };
                if(!Found){
                    return res.status(401).json({Message:"Option not found"});
                };

                b = true;
                element.Quantity = Number(req.body.Quantity);
            };
            ne.push(element);
        };
        if(b){
            await User.updateOne({_id:Got_User._id},{$set:{Cart:ne}});
            return res.status(200).json({Message:"Updated cart quantity"});
        } else{
            return res.status(401).json({Message:"No product found in cart"});
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
    Cart_Remove_Product ,
    Cart_Update_Option ,
    Cart_Update_Quantity ,
};