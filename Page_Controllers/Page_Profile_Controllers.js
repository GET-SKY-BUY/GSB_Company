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


const Profile_Address = ( req , res , next )=> {
    try{
        const User = req.User;

        let Address_Cards;
        const Address = User.Address;

        if(Address.Active_ID == ""){
            Address_Cards = `<p>You haven't added any address.</p>`;
        }else{
            
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