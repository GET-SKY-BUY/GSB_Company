const z = require('zod');
const Signup_User = z.object({
    First_Name: z.string().min(3).max(50),
    Last_Name: z.string().min(3).max(50),
    Mobile_Number: z.string().min(10).max(10),
    Email: z.string().email(),
    Gender: z.string().min(4).max(6),
    DOB: z.string().min(3),
    Password: z.string().min(8).max(50),
});
const Login_User = z.object({
    Email: z.string().email(),
    Password: z.string().min(8).max(50),
});
const Update_User = z.object({
    First_Name: z.string().max(50).min(3),
    Last_Name: z.string().max(50).min(3),
    Mobile_Number: z.string().max(10).min(10),
    Gender: z.string().max(6).min(4),
    DOB: z.string().min(3),
});

module.exports = { 
    Signup_User ,
    Login_User ,
    Update_User 
};