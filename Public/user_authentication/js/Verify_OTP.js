async function Confirm(){
    let OTP = document.getElementById("OTP").value;
    document.getElementById("Next_Btn").disabled = true;
    document.getElementById("Next_Btn1").disabled = true;
    document.getElementById("Loading").style.display = "flex";
    if (!OTP) {
        document.getElementById("Next_Btn").disabled = false;
        document.getElementById("Next_Btn1").disabled = false;
        Message("Please enter the OTP","Warning");
        document.getElementById("Loading").style.display = "none";
        return;
    }else if (OTP.length != 6) {
        document.getElementById("Next_Btn").disabled = false;
        document.getElementById("Next_Btn1").disabled = false;
        document.getElementById("Loading").style.display = "none";
        Message("Please enter a valid OTP","Warning");
        document.getElementById("OTP").value = "";

        return;
    }else{
        const Sent = {
            OTP: OTP,
        }
        await fetch("/api/v1/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Sent),
        }).then(async response=>{
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
        }).then(data =>{
            Message(data.Message,"Success");
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 1500);
        }).catch(e=>{
            if (e.Message) {
                
                document.getElementById("Next_Btn").disabled = false;
                document.getElementById("Next_Btn1").disabled = false;
                Message(e.Message,"Warning");
                
            }else{
                document.getElementById("Next_Btn").disabled = false;
                document.getElementById("Next_Btn1").disabled = false;
                Message("Connection error","Warning");
            };
        });
    };
};
const ActualTime = 90;
let Time = ActualTime;
function Start() {   
    const DC = setInterval(() => {
        Time--;
        document.getElementById("Next_Btn1").innerHTML = `Resend OTP, after ${Time} seconds`;
        if (Time == -1) {
            document.getElementById("Next_Btn1").innerHTML = "Haven't recieved OTP? Resend";
            clearInterval(DC);
        }       
    }, 1000);
}
Start();

async function Resend(){
    document.getElementById("Next_Btn").disabled = true;
    document.getElementById("Next_Btn1").disabled = true;
    document.getElementById("Loading").style.display = "flex";
    if (Time !== -1) {
        document.getElementById("Next_Btn").disabled = false;
        document.getElementById("Next_Btn1").disabled = false;
        Message(`Please wait for ${Time} seconds`,"Warning");
        document.getElementById("Loading").style.display = "none";
    }else{
        await fetch("/api/v1/auth/verify-otp/resend", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({Sent:"Yes"}),
        }).then(async response=>{
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
        }).then(data =>{
            Time = ActualTime;
            Start();
            Message(data.Message,"Success");
            document.getElementById("Next_Btn").disabled = false;
            document.getElementById("Next_Btn1").disabled = false;
        }).catch(e=>{
            if (e.Message) {
                document.getElementById("Next_Btn").disabled = false;
                document.getElementById("Next_Btn1").disabled = false;
                Message(e.Message,"Warning");
            }else{
                document.getElementById("Next_Btn").disabled = false;
                document.getElementById("Next_Btn1").disabled = false;
                Message("Connection error","Warning");
            };
        });
    };
};