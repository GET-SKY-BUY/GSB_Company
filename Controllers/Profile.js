
const axios = require("axios");

const { Update_User , Add_Address } = require("../utils/Zod_Schema.js");
const { Valid_Mobile } = require("../utils/Validations.js");
const { Add_Bank } = require("../utils/Zod_Schema.js");
const Profile_Setting = async (req, res , next) => {
    try {
        const User = req.User;
        function Validation(First_Name, Last_Name, Mobile_Number, DOB, Gender) {
            if (First_Name == null || First_Name.length < 3) {
                return "Please enter a valid first name";
            }else if ( Last_Name == null || Last_Name.length < 3) {
                return "Please enter a valid last name";
            }else if (String(Mobile_Number) == null || !Valid_Mobile(String(Mobile_Number))) {
                return "Please enter a valid mobie number";
            }else if (Gender.length < 3 || Gender == null || Gender == "") {
                return "Please enter a gender";
            }else if ( DOB == null|| DOB.length < 4) {
                return "Please enter correct DOB";
            }else{
                return "Valid";
            };
        };

        const Valid2 = Validation(req.body.First_Name, req.body.Last_Name, req.body.Mobile_Number, req.body.DOB, req.body);
        if(Valid2 !== "Valid") {
            return res.status(400).json({ Status: "Failed" , Message: Valid2 });
        };
        const Valid = Update_User.safeParse(req.body);
        if (!Valid.success) {
            return res.status(400).json({ Status: "Failed" , Message: "Invalid data." });
        };

        User.Personal_Data = Valid.data;
        User.save().then(()=>{
            return res.status(200).json({Message: "Updated Successfully"});
        })
    } catch (error) {
        next(error);
    };
};

const Profile_Update_Bank = async (req, res , next) => {
    try {
        const Got_User = req.User;

        const Valid = Add_Bank.safeParse(req.body);
        if (!Valid.success) {
            return res.status(400).json({ Status: "Failed" , Message: "Invalid data." });
        };
        Got_User.Bank = Valid.data;
        Got_User.save().then(()=>{
            return res.status(200).json({Message: "Updated Successfully"});
        });
    } catch (error) {
        next(error);
    };
};
const Profile_Address_Add = async (req, res , next) => {
    try {
        const Got_User = req.User;
        const Valid = Add_Address.safeParse(req.body);
        if (!Valid.success) {
            return res.status(400).json({ Status: "Failed" , Message: "Invalid data." });
        };
        


        
        try{

            let recieved = await axios.get(`https://api.postalpincode.in/pincode/${Valid.data.PIN}`);
            
            if(recieved.status !== 200) {
                return res.status(400).json({
                    Status: "Failed",
                    Message: "Please enter a valid PIN code",
                });
            }
            
            const ID = Date.now();
            Valid.data.ID = String(ID);
            Got_User.Address.Active_ID = ID;
            Got_User.Address.List = [...Got_User.Address.List,...[Valid.data]];
            Got_User.save().then(()=>{
                return res.status(200).json({ Status: "Success" , Message: "Added Successfully."});
            }).catch(err=>{
                return res.status(400).json({ Status: "Failed" , Message: "Unable to add address.."});
            });
        
        }catch(error) {
            return res.status(400).json({
                Status: "Failed",
                Message: "Please enter a valid PIN code",
            });
        };

    } catch (error) {
        next(error);
    };
};

const Profile_Address_Edit = async (req, res , next) => {
    try {
        const Got_User = req.User;
        const Valid = Add_Address.safeParse(req.body);
        if (!Valid.success) {
            return res.status(400).json({ Status: "Failed" , Message: "Invalid data." });
        };
        


        
        try{

            let recieved = await axios.get(`https://api.postalpincode.in/pincode/${req.body.PIN}`);
            
            if(recieved.status !== 200) {
                return res.status(400).json({
                    Status: "Failed",
                    Message: "Please enter a valid PIN code",
                });
            }
            let ID = req.body.ID;
            let A = Got_User.Address.List;
            let Found = false;
            let New_List = [];
            for (let i = 0; i < A.length; i++) {
                const element = A[i];
                if(element.ID == ID) {
                    New_List.push({
                        ID: ID,
                        Name: Valid.data.Name,
                        Mobile_Number: Valid.data.Mobile_Number,
                        Alternative_Number: Valid.data.Alternative_Number,
                        PIN: Valid.data.PIN,
                        Address_Line: Valid.data.Address_Line,
                        Landmark: Valid.data.Landmark,
                    })
                    Found = true;
                }else{
                    New_List.push(element);
                };
            };
            if(!Found) {
                return res.status(401).json({
                    Status: "Failed",
                    Message: "Unauthorized access",
                });
            };
            Got_User.Address.List = New_List;
            await Got_User.save().then(()=>{
                return res.status(200).json({ Status: "Success" , Message: "Added Successfully."});
            }).catch(err=>{
                return res.status(400).json({ Status: "Failed" , Message: "Unable to add address.."});
            });
        
        }catch(error) {
            return res.status(400).json({
                Status: "Failed",
                Message: "Please enter a valid PIN code",
            });
        };
    } catch (error) {
        next(error);
    };
};

const Profile_Address_Delete = async (req, res , next) => {
    try {
        const Got_User = req.User;
        const ID = req.body.ID;
        if (ID == null || ID == "") {
            return res.status(400).json({ Status: "Failed" , Message: "Invalid data." });
        };
        const Address = Got_User.Address.List;
        const New_Address = [];
        for (let i = 0; i < Address.length; i++) {
            const element = Address[i];
            if(element.ID !== ID) {
                New_Address.push(element);
            };
        };
        Got_User.Address.List = New_Address;
        await Got_User.save().then(()=>{
            return res.status(200).json({ Status: "Success" , Message: "Deleted Successfully."});
        }).catch(err=>{
            return res.status(400).json({ Status: "Failed" , Message: "Unable to delete address.."});
        });
    } catch (error) {
        next(error);
    };
};

const Profile_Address_Active_Status = async (req, res , next) => {
    try {
        const Got_User = req.User;
        const ID = req.body.ID;
        if (ID == null || ID == "") {
            return res.status(400).json({ Status: "Failed" , Message: "Invalid data." });
        };

        const Address = Got_User.Address.List;
        let Found = false;
        for (let i = 0; i < Address.length; i++) {
            const element = Address[i];
            if(element.ID == ID) {
                Found = true;
                break;
            };
        };
        if(!Found) {
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized access",
            });
        };
        Got_User.Address.Active_ID = ID;
        await Got_User.save().then(()=>{
            return res.status(200).json({ Status: "Success" , Message: "Changed active address Successfully."});
        }).catch(err=>{
            return res.status(400).json({ Status: "Failed" , Message: "Unable to update address.."});
        });

    } catch (error) {
        next(error);
    };
};
module.exports = {
    Profile_Setting,
    Profile_Update_Bank,
    Profile_Address_Add,
    Profile_Address_Edit,
    Profile_Address_Delete,
    Profile_Address_Active_Status,
};