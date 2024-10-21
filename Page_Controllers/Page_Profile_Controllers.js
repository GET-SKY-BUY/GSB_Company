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
  
const axios = require("axios");

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
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });


    }catch (err){
        next(err);
    };
};

const Profile_Wishlist = ( req , res , next )=> {
    try{
        const User = req.User;

        const WishList = User.WishList;
        
        return res.status(200).render("Profile_Wishlist",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            WishList: WishList,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (err){
        next(err);
    };
};
const Profile_Favourite = ( req , res , next )=> {
    try{
        const User = req.User;

        const Favourite = User.Favourite;


        return res.status(200).render("Profile_Favourite",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            Favourite: Favourite,
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (err){
        next(err);
    };
};

const Profile_Notification = ( req , res , next )=> {
    try{
        const User = req.User;

        const Notification = User.Notification;


        return res.status(200).render("Profile_Notification",{
            First_Name: User.Personal_Data.First_Name,
            Last_Name: User.Personal_Data.Last_Name,
            Email: User.Email,
            Notification: Notification,
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
            Login:"",
            Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
        });
    }catch (err){
        next(err);
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
}