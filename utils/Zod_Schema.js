const zod = require('zod');
const Signup_User = zod.object({
    First_Name: zod.string().min(3).max(50),
    Last_Name: zod.string().min(3).max(50),
    Mobile_Number: zod.string().min(10).max(10),
    Email: zod.string().email(),
    Gender: zod.string().min(4).max(6),
    DOB: zod.string().min(3),
    Password: zod.string().min(8).max(50),
});
module.exports = { Signup_User };