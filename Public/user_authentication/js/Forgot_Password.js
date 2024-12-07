const Valid_Email = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

async function Send_OTP() {
    Message("Please wait...","Success");

    document.getElementById("Loading").style.display = "flex";
    document.getElementById("Next_Btn").disabled = true;
    if (!Valid_Email(document.getElementById("Email").value)) {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("Next_Btn").disabled = false;
        Message("Enter correct email","Warning");
    }else {
        const Sent = {
            Email: document.getElementById("Email").value,
        }
        await fetch("/api/v1/auth/forgot-password",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(Sent)
        }).then((response)=>{
            document.getElementById("Loading").style.display = "none";
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(Error_Data => {
                    const error = new Error(Error_Data.Message);
                    error.Message = Error_Data.Message;
                    throw error;
                });
            }
        }).then(data=>{
            
            Message(data.Message,"Success");
            setTimeout(() => {
                window.location.replace("/auth/reset-password");
            }, 600);
        }).catch(e=>{
            document.getElementById("Next_Btn").disabled = false;
            
            if (e.Message) {
                Message(e.Message,"Warning");
            }else{
                Message("Something happened, try again later.","Warning");
            };
        });
    };  
};