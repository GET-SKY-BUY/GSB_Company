require("dotenv").config();
const axios = require("axios");
const { Products } = require("../Models.js");

const INR = require("../utils/Number_INR.js");

const Checkout_Proceed = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        const Cart = Got_User.Cart;

        let Total_MRP = 0;
        let Total_Shipping_Cost = 0;
        let Total_Quantity = 0;
        let Grand_Total = 0;

        // for (let i = 0; i < Cart.length; i++) {
        // }

        const Addresses = Got_User.Address;
        
        const Active_Address = Addresses.Active_ID;

        if(Active_Address == "" || Active_Address == " "){
            return res.status(307).redirect("/profile/cart?message=First+add+an+address&redirect=/checkout/proceed");
        };

        const Address_List = Addresses.List;

        let Final_Address = null;

        for (let i = 0; i < Address_List.length; i++) {
            if (Address_List[i].ID == Active_Address) {
                Final_Address = Address_List[i];
                break;
            };
        };

        
        
        // Final_Address

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
                    Message: "PIN Code found",
                };
            }else{
                recieved = "Failed to load PIN address"
            };
        }catch(error) {
            recieved = "Failed to load PIN address"
        };

        let P = recieved;
        if (!(typeof recieved === "string")) {
            P = `${recieved.Town}, <br>Dist: ${recieved.District},,
            <br> ${recieved.State}, ${recieved.Country}`;
        };
        
        const Address = `
            ${Final_Address.Name},<br>
            ${Final_Address.Mobile_Number},<br>
            ${Final_Address.Alternative_Number} - Alt no.,<br>
            ${Final_Address.PIN},<br>
            ${Final_Address.Address_Line},<br>
            ${Final_Address.Landmark},<br>
            ${P},<br>
        `;


        
        if(Cart.length <= 0){
            return res.status(307).redirect("/profile/cart?message=Cart+is+empty&redirect=/checkout/proceed");
        };

        let Table = "";
        for (let i = 0; i < Cart.length; i++) {
            const Product = await Products.findById(Cart[i].Product_ID);
            if(Product){
                if(Product.Verified == "Yes"){


                    try{
                        if(Cart[i].Quantity < 1){
                            return res.status(307).redirect("/checkout/cart?message=Product+Quantity+is+not+available");
                        };
                        if(Cart[i].Variety == ""){
                            return res.status(307).redirect("/checkout/cart?message=Product+Variety+is+not+available");
                        };
                    }catch(error){
                        return res.status(307).redirect("/checkout/cart?message=Product+Quantity+is+not+available");
                    };

                    if(Cart[i].Quantity > Product.Quantity){
                        return res.status(307).redirect("/checkout/cart?message=Product+Quantity+is+not+available");
                    };



                    let DEL = Product.Delivery;
                    let DEL_Text = "Free";
                    let Total_Product_Price = Product.Price.Our_Price;
                    Total_Shipping_Cost += 0;
                    Total_Product_Price = Cart[i].Quantity*Product.Price.Our_Price;
                    if (DEL != 0) {
                        DEL_Text = `₹${INR(String(DEL))}`;
                        Total_Product_Price += DEL;
                        Total_Shipping_Cost += DEL;
                    };
                    Table += `
                    <tr>
                        <td><a href="/products/${Product.URL}">${Product.Title}</a></td>
                        <td>${Cart[i].Variety}</td>
                        <td>₹${INR(String(Product.Price.Our_Price))}</td>
                        <td>${DEL_Text}</td>
                        <td>${Cart[i].Quantity}</td>
                        <td>₹${INR(String(Total_Product_Price))}</td>
                    </tr>`;
                    Grand_Total+=Total_Product_Price;
                    Total_MRP += Cart[i].Quantity*Product.Price.MRP;
                    Total_Quantity+=Cart[i].Quantity;
                };
            };
        };
        const Options = {
            TOTAL_PRICE: INR(String(Grand_Total - Total_Shipping_Cost)),
            DISCOUNT: INR(String(Math.floor(((Total_MRP - Grand_Total)/Total_MRP)*100))),
            Grand_Total: INR(String(Grand_Total)),
            Total_Shipping: INR(String(Total_Shipping_Cost)),
            Total_Quantity: Total_Quantity,
            TOTAL_MRP: INR(String(Total_MRP)),
            Table: Table,
            Address:Address,
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        };
        return res.status(200).render("Checkout_Proceed", Options);
    }catch (error) {
        next(error);
    };
};

const Checkout_Cart = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        const Cart = Got_User.Cart;

        let Total_MRP = 0;
        let Total_Shipping_Cost = 0;
        let Total_Quantity = 0;
        let Grand_Total = 0;


        

        if(Cart.length <= 0){
            return res.status(200).render("Checkout_Cart", {

                CartNumber:Got_User.Cart.length,
                Login:"",
                Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
                Data_Of_Cart: "Cart is empty",
            })
        };

        

        return res.status(200).render("Checkout_Cart", {
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });

    } catch (error) {
        next(error);
    };
};

module.exports = {
    Checkout_Proceed,
    Checkout_Cart,
}