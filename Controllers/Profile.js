
const { Update_User } = require("../utils/Zod_Schema.js");
const { Valid_Mobile } = require("../utils/Validations.js");

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

module.exports = { Profile_Setting };