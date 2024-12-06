
const axios = require('axios');


const Pin_Codes = async (req, res, next) => {
    try {
        const Pin_Code = req.params.id;

        if (Pin_Code.length !== 6) {
            return res.status(400).json({
                Error: "Invalid Pin Code",
            });
        };

        try{

            let recieved = await axios.get(`https://api.postalpincode.in/pincode/${Pin_Code}`);
            
            if(recieved.status !== 200) {
                return res.status(400).json({
                    Status: "Failed",
                    Message: "Please enter a valid PIN code",
                });
            }
            
            recieved = recieved.data[0].PostOffice[0];
            
            const Sent = {
                Town: recieved.Name,
                PIN_Code: recieved.Pincode,
                State: recieved.State,
                Country: recieved.Country,
                Message: "PIN Code found",
            };
            return res.status(200).json(Sent);
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
module.exports = {
    Pin_Codes,
};