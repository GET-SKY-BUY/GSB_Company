
const Valid_Email = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};
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

async function Login() {
    Message("Please wait","Success");

    document.getElementById("Loading").style.display = "flex";
    document.getElementById("Next_Btn").disabled = true;
    if (!Valid_Email(document.getElementById("Email").value)) {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("Next_Btn").disabled = false;
        Message("Enter correct email","Warning");
    }else if (!Valid_Password(document.getElementById("Create_Password").value)) {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("Next_Btn").disabled = false;
        Message("Password must be 8 character, numbers, alphabets and symbols.","Warning");
    }else {
        const Sent = {
            Email: document.getElementById("Email").value,
            Password: document.getElementById("Create_Password").value,
        }
        await fetch("/api/v1/auth/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(Sent)
        }).then((response)=>{
            
            if (response.ok) {
                return response.json();
            }else if(response.status == 201){
                
                document.getElementById("Loading").style.display = "none";
                setTimeout(() => {
                    window.location.replace("/auth/verify-otp");
                }, 1000);
                return response.json().then(Error_Data => {
                    const error = new Error(Error_Data.Message);
                    error.Message = Error_Data.Message;
                    throw error;
                });
            } else {
                return response.json().then(Error_Data => {
                    const error = new Error(Error_Data.Message);
                    error.Message = Error_Data.Message;
                    throw error;
                });
            }
        }).then(data=>{
            
            document.getElementById("Loading").style.display = "none";
            Message(data.Message,"Success");
            // setTimeout(() => {
            //     document.getElementById("Loading").style.display = "none";
            //     location.reload();
            // }, 2000);
        }).catch(e=>{
            document.getElementById("Loading").style.display = "none";
            document.getElementById("Loading").style.display = "none";
            document.getElementById("Next_Btn").disabled = false;
            
            if (e.Message) {
                Message(e.Message,"Warning");
            }else{
                Message("Something happened, try again later.","Warning");
            };
        });
    
    };
    
}