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
            Logout: `<a title="Logout" href="/logout">Logout</a>`,
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
            Logout: `<a title="Logout" href="/logout">Logout</a>`,
        });

    }catch (err){
        next(err);
    }
}


module.exports = {
    Home,
    Setting,
}