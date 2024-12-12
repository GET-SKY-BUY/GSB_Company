function formatDateString(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const { Orders } = require("../Models.js");
const INR = require("../utils/Number_INR.js");
const axios = require("axios");
const { Get_Categories , Get_Categories_Option } = require("../utils/Categories.js");

const Home = async (req, res, next) =>  {
    try {
        const User = req.User;
        
        const Joined = User.createdAt.toDateString();
        const Coins = User.GSBCoins.Available;
        const CartNumber = User.Cart.length;
        const DOB = formatDateString(User.Personal_Data.DOB);

        return res.status(200).render("Profile_Home",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            Mobile_Number: User.Personal_Data.Mobile_Number,
            DOB: DOB,
            Gender: User.Personal_Data.Gender,
            Coins:Coins,
            Joined:Joined,
            
            CartNumber: CartNumber,
            Get_Categories_Option : await Get_Categories_Option(next),
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    } catch (error) {
        next(error);
    };
};

const Setting = async (req, res, next) =>  {
    try {
        const User = req.User;
        const Joined = User.createdAt.toDateString();
        const Coins = User.GSBCoins.Available;
        const CartNumber = User.Cart.length;
        const DOB = formatDateString(User.Personal_Data.DOB);

        return res.status(200).render("Profile_Setting", {
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            Mobile_Number: User.Personal_Data.Mobile_Number,
            DOB: DOB,
            Gender: User.Personal_Data.Gender,
            Coins:Coins,
            Joined:Joined,
            Bank_Name: User.Bank.Bank_Name,
            Beneficiary_Name: User.Bank.Beneficiary_Name,
            Account_Number: User.Bank.Account_Number,
            IFSC_Code: User.Bank.IFSC_Code,
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber: CartNumber,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });

    }catch (err){
        next(err);
    };
};

const Coins = async (req, res, next) =>  {
    try{
        const Got_User = req.User;

        const History = Got_User.GSBCoins.History;

        return res.status(200).render("Profile_Coins",{
            First_Name: Got_User.Personal_Data.First_Name,
            Last_Name: Got_User.Personal_Data.Last_Name,
            Email: Got_User.Email,

            CoinsAvailable: Got_User.GSBCoins.Available,
            CoinsEarned: Got_User.GSBCoins.Earned,
            CoinsHistory: History,
            
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });


    }catch (err){
        next(err);
    };
};

const Profile_Wishlist = async ( req , res , next )=> {
    try{
        const User = req.User;

        const WishList = User.WishList;
        
        return res.status(200).render("Profile_Wishlist",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            WishList: WishList,
            
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (err){
        next(err);
    };
};
const Profile_Favourite = async ( req , res , next )=> {
    try{
        const User = req.User;

        const Favourite = JSON.stringify(User.Favourite);


        return res.status(200).render("Profile_Favourite",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            Favourite: Favourite,
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (err){
        next(err);
    };
};

const Profile_Notification = async ( req , res , next )=> {
    try{
        const User = req.User;

        const Notification = User.Notification;


        return res.status(200).render("Profile_Notification",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            Get_Categories_Option : await Get_Categories_Option(next),
            Notification: Notification,
            CartNumber:User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (err){
        next(err);
    };
};


const Profile_Address = async ( req , res , next )=> {
    try{
        const User = req.User;

        let Address_Cards = "";
        const Address = User.Address;

        if(Address.Active_ID == ""){
            Address_Cards = `<p>You haven't added any address.</p>`;
        }else{

            let ZZ = "";
            for (let i = 0; i < Address.List.length; i++) {
                const element = Address.List[i];
                

                let Sent;
                try{

                    let recieved = await axios.get(`https://api.postalpincode.in/pincode/${element.PIN}`);
                    
                    if(recieved.status !== 200) {
                        return res.status(400).json({
                            Status: "Failed",
                            Message: "Please enter a valid PIN code",
                        });
                    }
                    
                    recieved = recieved.data[0].PostOffice[0];
                    
                    Sent = {
                        Town: recieved.Name,
                        PIN_Code: recieved.Pincode,
                        State: recieved.State,
                        Country: recieved.Country,
                        Message: "PIN Code found",
                    };
                }catch(error) {
                    return res.status(400).json({
                        Status: "Failed",
                        Message: "Please enter a valid PIN code",
                    });
                };
                if(element.ID == Address.Active_ID){
                    ZZ = `
                        <div class="Cards" id="Card_${i}">
                            <div class="Cards_Head">${element.Name}</div>
                            <div class="Cards_Body">
                                <div>${element.Name}</div>
                                <div>${element.Mobile_Number}</div>
                                <div>${element.Alternative_Number} - (Alternative)</div>
                                <div>${element.PIN}</div>
                                <div>${element.Landmark}</div>
                                <div>${element.Address_Line}</div>
                                <div>${Sent.Town},</div>
                                <div>${Sent.State}, ${Sent.Country}</div>
                            </div>
                            <div class="Cards_Footer">
                                <button id="Edit_${i}" onclick="Edit('${element.ID}',${i});" type="button" class="material-symbols-outlined">edit</button>
                            </div>
                        </div>`;
                }else{
                    let D = `
                    <div class="Cards" id="Card_${i}">
                        <div class="Cards_Head">${element.Name}</div>
                        <div class="Cards_Body">
                            <div>${element.Name}</div>
                            <div>${element.Mobile_Number}</div>
                            <div>${element.Alternative_Number} - (Alternative)</div>
                            <div>${element.PIN}</div>
                            <div>${element.Landmark}</div>
                            <div>${element.Address_Line}</div>
                            <div>${Sent.Town},</div>
                            <div>${Sent.State}, ${Sent.Country}</div>
                        </div>
                        <div class="Cards_Footer">
                            <button id="Delete_${i}" onclick="Delete('${element.ID}',${i});" type="button" class="material-symbols-outlined">delete</button>
                            <button id="Edit_${i}" onclick="Edit('${element.ID}',${i});" type="button" class="material-symbols-outlined">edit</button>
                            <button id="Set_${i}" onclick="Set('${element.ID}',${i});" style="font-size: 14px;" class="Set_Default">Set as default</button>
                        </div>
                    </div>`;
                    Address_Cards = D + Address_Cards;
                    
                }
            }
            Address_Cards = ZZ + Address_Cards;
            
        };
        
        return res.status(200).render("Profile_Address",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            Address_Cards: Address_Cards,
            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (err){
        next(err);
    };
};


const Profile_Orders = async ( req , res , next ) => {
    try {
        const Got_User = req.User;


        const All_Orders = Got_User.Orders;



        let New_Li = "";

        for (let i = 0; i < All_Orders.length; i++) {
            const Ref_Order = All_Orders[i];
            let Order_No_List = await Orders.find({Connection_ID: Ref_Order.Key}).populate("Product.Product_ID").exec();
            
            let AA = `
            
                    <div class="Ref_No">
                        <strong>Ref no: </strong> <span>${Ref_Order.Key}</span>
                    </div>
            `;


            for (let j = 0; j < Order_No_List.length; j++) {
                let Order = Order_No_List[j];


                
                
                
                const dateObject = new Date(Order.createdAt);
                let Ord_Date = dateObject.toDateString();
                const delDateObject = new Date(dateObject);
                delDateObject.setDate(delDateObject.getDate() + 10);
                let Del_Date = delDateObject.toDateString();
                
                let Return =  "No return or replaced requested";

                if(Order.Return_Refund.Request_Type){
                    Return = Order.Return_Refund.Request_Type;
                };


                New_Li += ` 
                <div class="Order_List">
                    ${AA}
                    
                    <div class="Main_Orders">
                        <div class="Main_Order_No">
                            <strong>Order no: </strong> <span>${Order._id} | <strong>Status: </strong> <span>${Order.Status}</span></span>
                        </div>

                        <div class="Products_Orders_Main">

                            <div class="Top_Order_Part">
                                <a href="/products/${Order.Product.Product_ID.URL}">
                                    <img src="/product/files/image/${Order.Product.Product_ID.Image_Videos.Image[0]}" alt="${Order.Product.Title}">
                                </a>
                            </div>
                            <div class="Top_Order_Title">
                                <h4>
                                    <a href="/products/${Order.Product.Product_ID.URL}" class="Anc">${Order.Product.Title}</a>
                                </h4>
                                <div class="Prices_Orders">
                                    <span class="Cart_Price">₹ ${INR(String(Order.Product.Price.Our_Price))}</span>

                                    <span class="Cart_MRP">MRP: ${INR(String(Order.Product.Price.MRP))}</span>

                                    
                                </div>
                                <div>
                                    <span><strong>Option: </strong> ${Order.Variety}</span><br>
                                    <span><strong>Quantity: </strong> ${Order.Quantity}</span><br>
                                    <span><strong>Payment Method: </strong>${Order.Payment_Type}</span><br>
                                    <span><strong>Order Date: </strong> ${Ord_Date}</span><br>
                                    <span><strong>Delivery Date: </strong> ${Del_Date}</span> <br>
                                    <span><strong>Coins Earned: </strong>${Order.GSB_Coins.Coins}</span> <br>
                                    <span><strong>Total: </strong>₹ ${INR(String(Order.Total_Bill.Grand_Total))}</span> <br>
                                    <span><strong>Refund/Return: </strong> ${Return}</span> <br>
                                    <span><a href="/contact_us">Raise an issue with this order.</a></span> <br>
                                </div>
                            </div>


                        </div>
                    </div>

                </div>
                `;

            }
        };

        if(New_Li == ""){
            New_Li = `<p>You haven't placed any orders yet.</p>`;
        }
        res.status(200).render("Profile_Orders",{
            First_Name: Got_User.Personal_Data.First_Name,
            Last_Name: Got_User.Personal_Data.Last_Name,
            Email: Got_User.Email,
            List: New_Li,

            Get_Categories_Option : await Get_Categories_Option(next),
            CartNumber:Got_User.Cart.length,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    } catch (error) {
        next(error);
    };
};


module.exports = {
    Home,
    Setting,
    Coins,
    Profile_Wishlist,
    Profile_Favourite,
    Profile_Notification,
    Profile_Address,
    Profile_Orders,
}