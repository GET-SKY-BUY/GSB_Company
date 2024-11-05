



const INR = require("../utils/Number_INR.js");


const { Products } = require('../Models.js');

const Product_List = async ( req , res , next ) => {
    try {
        
        const Product1 = await Products.find({Verified:"Yes"});
        if(!Product1){
            return res.status(200).json({Tags:""});
        };
        let a = "";

        let NumberOfProducts = (Number(req.body.Width)+400)/200;
        let PRODUCT_LIST = req.body.PRODUCT_LIST;
        let Len = Product1.length;
        let le = Len;
        let NN = 0;
        while(NumberOfProducts > NN){
            let index = Math.floor((Math.random())*le);
            // console.log(index);
            const element = Product1[index];
            if(PRODUCT_LIST.includes(element._id)){
                continue;
            };
            let Offer = Math.floor(((element.Price.MRP - element.Price.Our_Price)/element.Price.MRP)*100);
            
            a += `
                <div class="Product" title="${element.Title}">
                <div title="Product Image" class="Product_Image">
                <a href="/products/${element.URL}">

                        <img src="/product/files/image/${element.Image_Videos.Image[0]}" alt="Product Image">
                        </a>

                </div>
                <h5 title="${element.Title}" class="Product_Title">
                    <a href="/products/${element.URL}">${element.Title}</a>
                </h5>
                <div title="Price" class="Product_Pricing">
                    <span class="MRPP">₹</span>
                    <span class="MRPPp">${INR(`${element.Price.Our_Price}`)}</span>
                    <span class="Product_Offer">${Offer}% OFF</span>
                    <br><span class="MRRP">Rs. ${INR(`${element.Price.MRP}`)}</span>
                </div>

                <div class="Product_Buttons">
                <button type="button" id="AddtoCart_${element._id}" onclick="AddToCart('${element._id}');">Add to cart</button>
                <button type="button" id="BuyNow_${element._id}" onclick="BuyNow('${element._id}');">Buy now</button>
                </div>
                <p class="Product_OneLine">Verified product</p>
                
                </div>
        
            `;

            PRODUCT_LIST.push(element._id);
            NN++;
        }
        
        return res.status(200).json({Tags:a, PRODUCT_LIST:PRODUCT_LIST});

    } catch (error) {
        next(error);
    };
};

module.exports = {
    Product_List,
};