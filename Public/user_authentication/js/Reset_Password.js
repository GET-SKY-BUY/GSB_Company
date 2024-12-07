
const Valid_Password = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};


function ShowClick(n) {
    // let ShowClick = document.getElementById("ShowClick");
    let Create_Password = document.getElementById("Create_Password");
    if (n == 1) {
        Create_Password.type = "text";
        // ShowClick.innerHTML = "visibility";
        document.getElementById("ShowPassword").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick" onclick="ShowClick(2);">visibility</span>`;
        
    }else{
        
        document.getElementById("ShowPassword").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick" onclick="ShowClick(1);">visibility_off</span>`;
        // ShowClick.onclick = ShowClick(1);
        Create_Password.type = "password";
        // ShowClick.innerHTML = "visibility_off";
    }
    
}

async function Verify() {
    Message("Please wait...","Success");

    document.getElementById("Loading").style.display = "flex";
    document.getElementById("Next_Btn").disabled = true;
    if (document.getElementById("OTP").value.length != 6) {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("Next_Btn").disabled = false;
        Message("Enter valid OTP","Warning");
    }else if (!Valid_Password(document.getElementById("Create_Password").value)) {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("Next_Btn").disabled = false;
        Message("Password must be 8 character, numbers, alphabets and symbols.","Warning");
    }else {
        const Sent = {
            OTP: document.getElementById("OTP").value,
            New_Password: document.getElementById("Create_Password").value,
        }
        await fetch("/api/v1/auth/reset-password",{
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
                window.location.replace("/auth/login");
            }, 800);
        }).catch(e=>{
            document.getElementById("Next_Btn").disabled = false;
            
            if (e.Message) {
                Message(e.Message,"Warning");
            }else{
                Message("Something happened, try again later.","Warning");
            };
        });
    
    };
    
}