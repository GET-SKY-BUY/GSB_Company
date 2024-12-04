require("dotenv").config();
const axios = require("axios");
const { Products } = require("../Models.js");

const INR = require("../utils/Number_INR.js");


const { Get_Categories , Get_Categories_Option } = require("../utils/Categories.js");


const Checkout_Proceed = async ( req , res , next ) => {
    try {

        const Type = req.params.Type;

        if(Type){
            if(Type == "now"){

                    

                const Got_User = req.User;
                const Product_Buy_Now = Got_User.Buy_Now;

                let Total_MRP = 0;
                let Total_Shipping_Cost = 0;
                let Total_Quantity = 0;
                let Grand_Total = 0;

                const Addresses = Got_User.Address;        
                const Active_Address = Addresses.Active_ID;
                if(Active_Address == "" || Active_Address == " "){
                    return res.status(307).redirect("/profile/address?message=First+add+an+address&redirect=/checkout/proceed");
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
                    P = `${recieved.Town}, <br>Dist: ${recieved.District},
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

                if(Product_Buy_Now.length <= 0){
                    return res.status(307).redirect("/checkout/cart?message=buy+now+is+empty&redirect=/checkout/proceed");
                };

                let Table = "";
                let Cart_Selected = Product_Buy_Now[0];
                const Product = await Products.findById(Cart_Selected.Product_ID);
                if(!Product){
                    return res.status(307).redirect("/checkout/cart?message=Product+not+found&redirect=/checkout/proceed");
                };

                if(Product.Verified !== "Yes"){
                    return res.status(307).redirect("/checkout/cart?message=Product+not+verified&redirect=/checkout/proceed");
                };

                if(Cart_Selected.Quantity < 1){
                    return res.status(307).redirect("/checkout/cart?message=Product+Quantity+is+not+available");
                };
                if(Cart_Selected.Variety == ""){
                    return res.status(307).redirect("/checkout/cart?message=Product+Variety+is+not+available");
                };

                for (let v = 0; v < Product.Varieties.length; v++) {
                    if(Product.Varieties[v].Type == Cart_Selected.Variety){
                        if(Product.Varieties[v].Quantity < 1){
                            return res.status(307).redirect("/checkout/cart?message=Your+buy+now+contains+products+which+are+out+of+stock.+Please+remove+them+to+proceed+or+change+the+option.");
                        };
                        break;
                    };
                }

                let DEL = Product.Delivery;
                let DEL_Text = "Free";

                let Total_Product_Price = Product.Price.Our_Price;
                Total_Product_Price = Cart_Selected.Quantity*Total_Product_Price;

                if (DEL != 0) {
                    DEL_Text = `₹${INR(String(DEL))}/item`;
                    Total_Product_Price += DEL*Cart_Selected.Quantity;
                    Total_Shipping_Cost += DEL*Cart_Selected.Quantity;
                };


                Table += `
                <tr>
                    <td><a href="/products/${Product.URL}">${Product.Title}</a></td>
                    <td>${Cart_Selected.Variety}</td>
                    <td>₹${INR(String(Product.Price.Our_Price))}</td>
                    <td>${DEL_Text}</td>
                    <td>${Cart_Selected.Quantity}</td>
                    <td>₹${INR(String(Total_Product_Price))}</td>
                </tr>`;
                Grand_Total+=Total_Product_Price;
                Total_MRP += Cart_Selected.Quantity*Product.Price.MRP;
                Total_Quantity+=Cart_Selected.Quantity;
                
                const Options = {
                    TOTAL_PRICE: INR(String(Grand_Total - Total_Shipping_Cost)),
                    DISCOUNT: String(parseInt(((Total_MRP - (Grand_Total - Total_Shipping_Cost))/Total_MRP)*100, 10)),
                    Grand_Total: INR(String(Grand_Total)),
                    Total_Shipping: INR(String(Total_Shipping_Cost)),
                    Total_Quantity: Total_Quantity,
                    TOTAL_MRP: INR(String(Total_MRP)),
                    Table: Table,
                    Address:Address,

                    Get_Categories_Option : await Get_Categories_Option(next),
                    CartNumber:Got_User.Cart.length,
                    Login:"",
                    Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
                };
                return res.status(200).render("Checkout_Proceed", Options);











                
                
                
                
                
                
                



























































            }else if(Type === "cart"){
                




































                

        const Got_User = req.User;
        const Cart = Got_User.Cart;

        let Total_MRP = 0;
        let Total_Shipping_Cost = 0;
        let Total_Quantity = 0;
        let Grand_Total = 0;

        const Addresses = Got_User.Address;        
        const Active_Address = Addresses.Active_ID;
        if(Active_Address == "" || Active_Address == " "){
            return res.status(307).redirect("/profile/address?message=First+add+an+address&redirect=/checkout/proceed");
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
            P = `${recieved.Town}, <br>Dist: ${recieved.District},
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
            return res.status(307).redirect("/checkout/cart?message=Cart+is+empty&redirect=/checkout/proceed");
        };

        let Table = "";
        for (let i = 0; i < Cart.length; i++) {
            let Cart_Selected = Cart[i]
            const Product = await Products.findById(Cart_Selected.Product_ID);
            if(Product){
                if(Product.Verified == "Yes"){


                    if(Cart_Selected.Quantity < 1){
                        return res.status(307).redirect("/checkout/cart?message=Product+Quantity+is+not+available");
                    };
                    if(Cart_Selected.Variety == ""){
                        return res.status(307).redirect("/checkout/cart?message=Product+Variety+is+not+available");
                    };

                    for (let v = 0; v < Product.Varieties.length; v++) {
                        if(Product.Varieties[v].Type == Cart_Selected.Variety){
                            if(Product.Varieties[v].Quantity < 1){
                                return res.status(307).redirect("/checkout/cart?message=Your+cart+contains+products+which+are+out+of+stock.+Please+remove+them+to+proceed+or+change+the+option.");
                            };
                            break;
                        };
                    }

                    // Total_Shipping_Cost += 0;

                    let DEL = Product.Delivery;
                    let DEL_Text = "Free";

                    let Total_Product_Price = Product.Price.Our_Price;
                    Total_Product_Price = Cart_Selected.Quantity*Total_Product_Price;

                    if (DEL != 0) {
                        DEL_Text = `₹${INR(String(DEL))}/item`;
                        Total_Product_Price += DEL*Cart_Selected.Quantity;
                        Total_Shipping_Cost += DEL*Cart_Selected.Quantity;
                    };


                    Table += `
                    <tr>
                        <td><a href="/products/${Product.URL}">${Product.Title}</a></td>
                        <td>${Cart_Selected.Variety}</td>
                        <td>₹${INR(String(Product.Price.Our_Price))}</td>
                        <td>${DEL_Text}</td>
                        <td>${Cart_Selected.Quantity}</td>
                        <td>₹${INR(String(Total_Product_Price))}</td>
                    </tr>`;
                    Grand_Total+=Total_Product_Price;
                    Total_MRP += Cart_Selected.Quantity*Product.Price.MRP;
                    Total_Quantity+=Cart_Selected.Quantity;
                };
            };
        };
        const Options = {
            TOTAL_PRICE: INR(String(Grand_Total - Total_Shipping_Cost)),
            DISCOUNT: String(parseInt(((Total_MRP - (Grand_Total - Total_Shipping_Cost))/Total_MRP)*100, 10)),
            Grand_Total: INR(String(Grand_Total)),
            Total_Shipping: INR(String(Total_Shipping_Cost)),
            Total_Quantity: Total_Quantity,
            TOTAL_MRP: INR(String(Total_MRP)),
            Table: Table,
            Address:Address,

            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        };
        return res.status(200).render("Checkout_Proceed", Options);

                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
            };
        };

        return res.status(307).redirect("/checkout/proceed/cart");
        
    }catch (error) {
        next(error);
    };
};

const Checkout_Cart = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        const Cart = Got_User.Cart;

        

        if(Cart.length <= 0){
            return res.status(200).render("Checkout_Cart", {
                CartNumber:Got_User.Cart.length,
                Login:"",
                Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
                Data_Of_Cart: "Cart is empty",
            })
        };




        let p = "";
        let FF = false;
        for (let i = 0; i < Cart.length; i++) {
            const Product = await Products.findById(Cart[i].Product_ID);
            // console.log(Product);
            if(Product){
                if(Product.Verified == "Yes"){





                    
                    // console.log(Product.Varieties);
                    let Options = "<option value=" + Cart[i].Variety + ">" + Cart[i].Variety + "</option>";
                    for (let i = 0; i < Product.Varieties.length; i++) {
                        if(Product.Varieties[i].Quantity >= 1){
                            Options += `<option value="${Product.Varieties[i].Type}">${Product.Varieties[i].Type}</option>`;
                        };
                    };
                
                    let Opt = Options;






                    let Qt = `<option value="${Cart[i].Quantity}">${Cart[i].Quantity}</option>`;
                    let FFF = "";
                    let fg = false;
                    for (let v = 0; v < Product.Varieties.length; v++) {
                        if (Product.Varieties[v].Type == Cart[i].Variety) {

                            if(Product.Varieties[v].Quantity < 1){
                                fg = true;
                                Qt = `<option disabled>Out Of stock</option>`;
                                break;
                            };

                            let total_len = Product.Varieties[v].Quantity;
                            // console.log(total_len);
                            for (let i = 1; i <= total_len; i++) {
                                FFF += `<option value="${i}">${i}</option>`;
                            };
                            break;
                        };

                    };
                    let GGG;
                    let Inside;
                    
                    if (fg) {
                        Inside = `
                        
                            <div>
                                <label class="Choose_Label" for="Choose_${i}">Choose option: </label>
                                <select class="Choose_Select" id="Choose_${i}" onchange="Option_Change(${i}, '${Cart[i].ID}')">
                                    ${Opt}
                                </select>
                            </div>
                            
                            <div style="color: red; font-size: 18px; font-weight: bold; ">Selected option is "OUT OF STOCK" </div>
                            
                            <div class="Remove_Div">
                                <button type="button" onclick="Remove_Cart(${i},'${Cart[i].ID}')">Remove</button>
                            </div>
                        `;
                    }else {
                            
                        Qt = Qt + FFF;
                        GGG = Qt;
                        Inside = `
                        
                            <div>
                                <label class="Choose_Label" for="Choose_${i}">Choose option: </label>
                                <select class="Choose_Select" id="Choose_${i}" onchange="Option_Change(${i}, '${Cart[i].ID}')">
                                    ${Opt}
                                </select>
                            </div>
                            
                            <div>
                                <label class="Choose_Label" for="Qt_${i}">Quantity: </label>
                                <select class="Choose_Select" id="Qt_${i}" onchange="Qty_Change(${i}, '${Cart[i].ID}')">
                                    ${GGG}
                                </select>

                            </div>
                            <div class="Remove_Div">
                                <button type="button" onclick="Remove_Cart(${i},'${Cart[i].ID}')">Remove</button>
                            </div>
                        `;


                    };










                    let OOS = false;
                    for (let i = 0; i < Product.Varieties.length; i++) {
                        if(Product.Varieties[i].Quantity >= 1){
                            OOS = true;
                            break;
                        };
                    };

                    if(!OOS){
                        Inside = `
                        
                            <div style="color: red; font-size: 18px; font-weight: bold; "> OUT OF STOCK </div>
                            <div class="Remove_Div">
                                    <button type="button" onclick="Remove_Cart(${i},'${Cart[i].ID}')">Remove</button>
                            </div>
                        `;
                    };



                    
                    
                    
                    
                    
                    
                    







                    p += `
                        <div class="Cart_Product" id="Cart_Number_${i}">
                            <div class="Cart_Image_Box">
                                <a href="/products/${Product.URL}">
                                    <img src="/product/files/image/${Product.Image_Videos.Image[0]}" alt="Product Image">
                                </a>
                            </div>

                            <div class="Cart_Main_Body">
                                <h4>${Product.Title}</h4>
                                <div class="Cart_Price">₹ ${INR(String(Product.Price.Our_Price))}</div>

                                <div class="Cart_MRP">MRP: ${INR(String(Product.Price.MRP))}</div>
                                ${Inside}
                                
                            </div>
                        </div>
                        `;
                };
            };
        };

        

        return res.status(200).render("Checkout_Cart", {
            Data_Of_Cart: p,
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });

    } catch (error) {
        next(error);
    };
};

const Checkout_Buy_Now = async ( req , res , next ) => {
    try {


        
        const Got_User = req.User;
        const Cart = Got_User.Cart;

        

        if(Cart.length <= 0){
            return res.status(200).render("Checkout_Cart", {
                CartNumber:Got_User.Cart.length,
                Login:"",
                Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
                Data_Of_Cart: "Cart is empty",
            })
        };




        let p = "";
        let FF = false;
        for (let i = 0; i < Cart.length; i++) {
            const Product = await Products.findById(Cart[i].Product_ID);
            // console.log(Product);
            if(Product){
                if(Product.Verified == "Yes"){





                    
                    // console.log(Product.Varieties);
                    let Options = "<option value=" + Cart[i].Variety + ">" + Cart[i].Variety + "</option>";
                    for (let i = 0; i < Product.Varieties.length; i++) {
                        if(Product.Varieties[i].Quantity >= 1){
                            Options += `<option value="${Product.Varieties[i].Type}">${Product.Varieties[i].Type}</option>`;
                        };
                    };
                
                    let Opt = Options;






                    let Qt = `<option value="${Cart[i].Quantity}">${Cart[i].Quantity}</option>`;
                    let FFF = "";
                    let fg = false;
                    for (let v = 0; v < Product.Varieties.length; v++) {
                        if (Product.Varieties[v].Type == Cart[i].Variety) {

                            if(Product.Varieties[v].Quantity < 1){
                                fg = true;
                                Qt = `<option disabled>Out Of stock</option>`;
                                break;
                            };

                            let total_len = Product.Varieties[v].Quantity;
                            // console.log(total_len);
                            for (let i = 1; i <= total_len; i++) {
                                FFF += `<option value="${i}">${i}</option>`;
                            };
                            break;
                        };

                    };
                    let GGG;
                    let Inside;
                    
                    if (fg) {
                        Inside = `
                        
                            <div>
                                <label class="Choose_Label" for="Choose_${i}">Choose option: </label>
                                <select class="Choose_Select" id="Choose_${i}" onchange="Option_Change(${i}, '${Cart[i].ID}')">
                                    ${Opt}
                                </select>
                            </div>
                            
                            <div style="color: red; font-size: 18px; font-weight: bold; ">Selected option is "OUT OF STOCK" </div>
                            
                            <div class="Remove_Div">
                                <button type="button" onclick="Remove_Cart(${i},'${Cart[i].ID}')">Remove</button>
                            </div>
                        `;
                    }else {
                            
                        Qt = Qt + FFF;
                        GGG = Qt;
                        Inside = `
                        
                            <div>
                                <label class="Choose_Label" for="Choose_${i}">Choose option: </label>
                                <select class="Choose_Select" id="Choose_${i}" onchange="Option_Change(${i}, '${Cart[i].ID}')">
                                    ${Opt}
                                </select>
                            </div>
                            
                            <div>
                                <label class="Choose_Label" for="Qt_${i}">Quantity: </label>
                                <select class="Choose_Select" id="Qt_${i}" onchange="Qty_Change(${i}, '${Cart[i].ID}')">
                                    ${GGG}
                                </select>

                            </div>
                            <div class="Remove_Div">
                                <button type="button" onclick="Remove_Cart(${i},'${Cart[i].ID}')">Remove</button>
                            </div>
                        `;


                    };










                    let OOS = false;
                    for (let i = 0; i < Product.Varieties.length; i++) {
                        if(Product.Varieties[i].Quantity >= 1){
                            OOS = true;
                            break;
                        };
                    };

                    if(!OOS){
                        Inside = `
                        
                            <div style="color: red; font-size: 18px; font-weight: bold; "> OUT OF STOCK </div>
                            <div class="Remove_Div">
                                    <button type="button" onclick="Remove_Cart(${i},'${Cart[i].ID}')">Remove</button>
                            </div>
                        `;
                    };



                    
                    
                    
                    
                    
                    
                    







                    p += `
                        <div class="Cart_Product" id="Cart_Number_${i}">
                            <div class="Cart_Image_Box">
                                <a href="/products/${Product.URL}">
                                    <img src="/product/files/image/${Product.Image_Videos.Image[0]}" alt="Product Image">
                                </a>
                            </div>

                            <div class="Cart_Main_Body">
                                <h4>${Product.Title}</h4>
                                <div class="Cart_Price">₹ ${INR(String(Product.Price.Our_Price))}</div>

                                <div class="Cart_MRP">MRP: ${INR(String(Product.Price.MRP))}</div>
                                ${Inside}
                                
                            </div>
                        </div>
                        `;
                };
            };
        };

        

        return res.status(200).render("Checkout_Cart", {
            Data_Of_Cart: p,
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });




    } catch ( error ) {
        next(error);
    };
};

module.exports = {
    Checkout_Proceed,
    Checkout_Cart,
    Checkout_Buy_Now,
}
