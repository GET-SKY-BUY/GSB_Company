

const { Products } = require("../Models.js");

const INR = require("../utils/Number_INR.js");


const Products_Page = async ( req , res , next ) => {
    try {
        const { URL } = req.params;
        let Product = await Products.findOne({URL:URL}).populate("Seller_ID").exec();
        if(!Product){
            return res.status(404).render("404");
        };

        if(Product.Verified == "No"){
            return res.status(404).render("404");
        };
        // console.log(Product);
        
        let Shop_Name = Product.Seller_ID.Store.Shop_Name;
        let Shop_Location = Product.Seller_ID.Store.Shop_Location;

        let IMG =  "";
        for(let i=0; i<Product.Image_Videos.Image.length; i++){
            IMG += `
                <button class="ImgClick" onclick="ImageChange(${i});">
                    <img src="/product/files/image/${Product.Image_Videos.Image[i]}" id="ImageChange${i}" alt="Image product">
                </button>
            `;
        };



        const MRP = INR(String(Product.Price.MRP));
        const Sell = INR(String(Product.Price.Our_Price));

        let Table = "";
        for (let index = 0; index < Product.Table.length; index++) {
            const element = Product.Table[index];
            Table += `
                <tr>
                    <td>${element[0]}:</td>
                    <td>${element[1]}</td>
                </tr>`;
        };

        
        let Description = Product.Description;
        Description = Description.replace(/\n/g, '<br>')
        
        let Offer = Math.floor(((Product.Price.MRP - Product.Price.Our_Price)/Product.Price.MRP)*100);
        let Product_Object = {
            Title : Product.Title,
            IMG,
            Shop_Name,
            Shop_Location,
            MRP,
            Sell,
            Table,
            Offer,
            Description,
            ID: Product._id

        };
        
        
        const User = req.User;
        if ( User ) {
            const Favourite = User.Favourite;
            let Fav = false;
            for (let i = 0; i < Favourite.length; i++) {
                if(Favourite[i].Product_ID == Product._id){
                    Fav = true;
                    break;
                };
            };
            if(Fav){
                Product_Object["Fav_Icon"] = "Fav_Selected.png";
                Product_Object["Fav_Function"] = `UnFavourite('${Product._id}')`;
            } else {
                Product_Object["Fav_Icon"] = "Fav.png";
                Product_Object["Fav_Function"] = `Favourite('${Product._id}')`;  
            };
            Product_Object["CartNumber"] = User.Cart.length;
            Product_Object["Login"] = "";
            Product_Object["Logout"] =  `<a title="Logout" href="/logout">Logout</a>`;
        }else{
            
            Product_Object["CartNumber"] = 0;
            Product_Object["Login"] = `<a title="login" href="/login">Login</a>`;
            Product_Object["Logout"] =  ``;
        };
        return res.status(200).render("Product_Page" , Product_Object );

    } catch (error) {
        next(error);
    }
};
module.exports = {
    Products_Page
};