const axios = require("axios");
const { Products , User , Orders , Sellers , Assistants } = require("../Models.js");
const crypto = require('crypto');
require("dotenv").config();
const Order_ID = () => {
    return crypto.randomInt(1000, 99999999999999).toString();
};

const { Payment_Instance , Verify_Signature } = require("./Payment_Functions.js");

const Checkout_Proceed_COD = async ( req , res , next ) => {
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



        
        let Connection_Key;

        while (true) {
            Connection_Key = Order_ID();
            const Connection_Exists = await Orders.findOne({Connection_ID: Connection_Key});
            if(!Connection_Exists){
                break;
            };
        };
        
        if(Cart.length < 1){
            return res.status(400).json({Message:"Cart is empty"});
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
                            Payment_ID: null,
                            Payment_Success: false,
                            Payment_Status: null,
                        },
                        Return_Refund:{
                            Request_Type: null,
                            Accepted: false,
                            Reason: null,
                            Refund_Amount: 0,
                            Completed: false,
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
            Got_User.Cart = [];
            Got_User.Orders = [...Got_User.Orders, ...[Connection_Key]];
            await Got_User.save().then(() => {
                return res.status(200).json({Message:"Order Placed Successfully",Redirect:"/profile/orders"});
            });
        });
    } catch (error) {
        next(error);
    };
};


const Checkout_Proceed_Pay = async ( req , res , next ) => {
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


        let Connection_Key;

        while (true) {
            Connection_Key = Order_ID();
            const Connection_Exists = await Orders.findOne({Connection_ID: Connection_Key});
            if(!Connection_Exists){
                break;
            };
        };
        
        if(Cart.length < 1){
            return res.status(400).json({Message:"Cart is empty"});
        };

        let New_Orders = [];





        const Order_Details = await Payment_Instance.orders.create({
            amount: 10000,
            currency: "INR",
            receipt: Connection_Key,
            notes:{
                User_ID: Got_User._id,
                Products: Cart,
                date: new Date(),
            },


        });
        
        // console.log(Order_Details);
        
        
        
        

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
                        Status: "Order created - Payment Pending",
                        Payment_Type: "Prepaid",
                        Payment_Info: {
                            Order_ID: Order_Details.id,
                            Payment_ID: null,
                            Payment_Success: false,
                            Payment_Status: "Created",
                        },
                        Return_Refund:{
                            Request_Type: null,
                            Accepted: false,
                            Reason: null,
                            Refund_Amount: 0,
                            Completed: false,
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
        let Option_For_Order = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: Order_Details.amount,
            currency: Order_Details.currency,
            name: Got_User.Personal_Data.First_Name + " " + Got_User.Personal_Data.Last_Name,
            description: `Payment for ${New_Orders.length} orders and Order ID: ${Connection_Key}`,
            image: "/verified/files/images/GSB - Full-Txt.jpg",
            order_id: Order_Details.id,
            prefill: {
                name: Got_User.Personal_Data.First_Name + " " + Got_User.Personal_Data.Last_Name,
                email: Got_User.Email,
                contact: Got_User.Personal_Data.Mobile_Number,
            },
            notes: Order_Details.notes,
            theme: {
                color: "#ff914d"
            }
        };


        // console.log(New_Orders);
        await Orders.insertMany(New_Orders).then( async () => {
            Got_User.Cart = [];
            Got_User.Orders = [...Got_User.Orders, ...[Connection_Key]];
            await Got_User.save().then(() => {
                return res.status(200).json({Message:"Order Created successfully.", Option_For_Order: Option_For_Order});
            });
        });
    } catch (error) {
        next(error);
    };
};

const Checkout_Final_Signature_Check = async ( req , res , next ) => {
    try {

        const Got_User = req.User;
        const razorpay_order_id = req.body.razorpay_order_id;
        const razorpay_payment_id = req.body.razorpay_payment_id;
        const razorpay_signature = req.body.razorpay_signature;




        if(!(razorpay_order_id && 
            razorpay_payment_id &&
            razorpay_signature)){
            return res.status(400).json({Message:"Invalid Request"});
        };
        if(razorpay_order_id == ""){
            return res.status(400).json({Message:"Invalid Order ID"});
        };
        if(razorpay_payment_id == ""){
            return res.status(400).json({Message:"Invalid Payment ID"});
        };
        if(razorpay_signature == ""){
            return res.status(400).json({Message:"Invalid Signature"});
        };




        let Got_Order_By_Id = await Payment_Instance.orders.fetch(razorpay_order_id);

        if(!Got_Order_By_Id){
            return res.status(400).json({Message:"Unauthorized Access."});
        };
        // console.log(Got_Order_By_Id);
        if(Got_Order_By_Id.status !== "paid"){
            return res.status(400).json({Message:"Unauthorized Access."});
        };
        if(Got_Order_By_Id.amount_due !== 0){
            return res.status(400).json({Message:"Haven't paid the full amount."});
        };
        if(Got_Order_By_Id.amount_paid !== Got_Order_By_Id.amount){
            return res.status(400).json({Message:"Unauthorized Access."});
        };




        let User_Orders = Got_User.Orders;
        if(User_Orders.length < 1){
            return res.status(400).json({Message:"Unauthorized Access."});
        };

        let Order_Found = false;
        let Actual_Connection_ID = null;
        for(let i = 0; i < User_Orders.length; i++){
            let Order_Details = await Orders.find({Connection_ID: User_Orders[i]});
            if(Order_Details.length < 1){
                return res.status(400).json({Message:"Unauthorized Access."});
            };
            for(let j = 0; j < Order_Details.length; j++){
                const Order = Order_Details[j];
                if(Order.Payment_Info.Order_ID == razorpay_order_id){
                    Order_Found = true;
                    Actual_Connection_ID = Order_Details;
                    break;
                };
            }
            if(Order_Found){
                break;
            };
        };

        if(!Actual_Connection_ID){
            return res.status(400).json({Message:"Unauthorized Access."});
        };

        let Check = await Verify_Signature(razorpay_order_id , razorpay_payment_id , razorpay_signature);

        if(!Check){
            return res.status(400).json({Message:"Unauthorized Access."});
        };


        for(let i = 0; i < Actual_Connection_ID.length; i++){
            const Order = Actual_Connection_ID[i];
            Order.Payment_Info.Payment_ID = razorpay_payment_id;
            Order.Payment_Info.Payment_Success = true;
            Order.Payment_Info.Payment_Status = "Success";
            Order.Status = "Order placed - Payment Success";
            await Order.save();
        };
        return res.status(200).json({Message:"Payment Successful - Order placed successful.",Redirect:"/profile/orders"});
        
    } catch (error) {
        next(error);
    };
};


module.exports = {
    Checkout_Proceed_COD,
    Checkout_Proceed_Pay,
    Checkout_Final_Signature_Check,
};