const axios = require("axios");
const { Products , User , Orders , Sellers , Assistants } = require("../Models.js");
const crypto = require('crypto');
const Order_ID = () => {
    return crypto.randomInt(10000000000000, 99999999999999).toString();
};


const Checkout_Proceed = async ( req , res , next ) => {
    try {
        
        const Got_User = req.User;
        const Cart = Got_User.Cart;


        const Addresses = Got_User.Address;
        const Active_Address = Addresses.Active_ID;
        if(Active_Address == "" || Active_Address == " "){
            return res.status(400).json({Message:"First add an address",Redirect:"/profile/cart"});
        };
        const Address_List = Addresses.List;
        let Final_Address = null;
        for (let i = 0; i < Address_List.length; i++) {
            if (Address_List[i].ID == Active_Address) {
                Final_Address = Address_List[i];
                break;
            };
        };
        let recieved = null;
        try{
            recieved = await axios.get(`https://api.postalpincode.in/pincode/${Final_Address.PIN}`);
            if(recieved.status == 200) {
                recieved = recieved.data[0].PostOffice[0];                
                recieved = {
                    Town: recieved.Name,
                    District: recieved.District,
                    PIN_Code: recieved.Pincode,
                    State: recieved.State,
                    Country: recieved.Country,
                };
            }else{
                recieved = "Failed to load PIN address"
            };
        }catch(error) {
            recieved = "Failed to load PIN address"
        };
        if (typeof recieved === "string") {
            return res.status(400).json({Message:"Failed to load PIN address"});
        };
        Final_Address["Town"] = recieved.Town;
        Final_Address["District"] = recieved.District;
        Final_Address["State"] = recieved.State;
        Final_Address["Country"] = recieved.Country;

        console.log(Final_Address);
        


        
        let Connection_Key;

        while (true) {
            Connection_Key = Order_ID();
            const Connection_Exists = await Orders.findOne({Connection_ID: Connection_Key});
            if(!Connection_Exists){
                break;
            };
        };
        

        let New_Orders = [];
        for (let i = 0; i < Cart.length; i++) {
            const Product = await Products.findById(Cart[i].Product_ID);
            if(Product){
                if(Product.Verified == "Yes"){

                    try{
                        if(Cart[i].Quantity < 1){
                            return res.status(400).json({Message:"Product Quantity is not available"});
                        };
                        if(Cart[i].Variety == ""){
                            return res.status(400).json({Message:"Product Variety is not available"});
                        };
                    }catch(error){
                        return res.status(400).json({Message:"Product Quantity is not available"});
                    };

                    if(Cart[i].Quantity > Product.Quantity){
                        return res.status(400).json({Message:"Product Quantity is not available"});
                    };


                    let New_Id;
                    while (true) {
                        New_Id = Order_ID();
                        const Order_Exists = await Orders.findById(New_Id);
                        if(!Order_Exists){
                            break;
                        };
                    };
                    let New_Order = {
                        _id: New_Id,
                        Connection_ID: Connection_Key,
                        User_ID: Got_User._id,
                        Completed: false,
                        Status: "Order Placed",
                        Payment_Type: "COD",
                        Payment_Info: {
                            Order_ID: null,
                            Payment_Success: false,
                            Payment_ID: null,
                        },
                        Return_Refund:{
                            Request_Type: null,
                            Accepted: false,
                            Reason: null,
                            Refund_Amount: 0,
                            Status: null,
                        },
                        Address: Final_Address,
                        Quantity: Cart[i].Quantity,
                        Variety: Cart[i].Variety,
                        Product: {
                            Product_ID: Product._id,
                            Title: Product.Title,
                            Price: Product.Price,
                            Delivery: Product.Delivery,
                        },
                        GSB_Coins: {
                            Coins: Product.GSBCoins*Cart[i].Quantity,
                            Released: false,
                        },
                        Total_Bill:{
                            Total_Product_MRPs: Product.Price.MRP*Cart[i].Quantity,
                            Total_Product_Price: Product.Price.Our_Price*Cart[i].Quantity,
                            Total_Shipping_Cost: Product.Delivery,
                            Grand_Total: Product.Price.Our_Price*Cart[i].Quantity + Product.Delivery,
                        },
                        createdAt: new Date(),
                    };
                    New_Orders.push(New_Order);
                };
            };
        };


        await Orders.insertMany(New_Orders).then( async () => {
            console.log("Orders Placed");
            Got_User.Cart = [];
            Got_User.Orders = [...Got_User.Orders, ...[Connection_Key]];
            await Got_User.save().then(() => {
                console.log("User Updated");
                return res.status(200).json({Message:"Order Placed Successfully",Redirect:"/profile/orders"});
            });
        });
    } catch (error) {
        next(error);
    };
};
module.exports = {
    Checkout_Proceed,
};