const Valid_Email = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const Valid_Password = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
};

function validatePhoneNumber(number) {
    const re = /^[0-9]{10}$/;
    return re.test(String(number));
};
document.getElementById("Cloose").addEventListener("click", () => {
    document.getElementById("Message").style.display = "none";
});

function Message(n, W) {
    let TextMessage = document.getElementById("TextMessage");
    document.getElementById("Message").style.display = "flex";
    document.getElementById("MainMsg").innerHTML = n;
    if(W=="Warning"){
        TextMessage.style.backgroundColor = "#ffbebe";        
    }else if (W == "Success") {
        TextMessage.style.backgroundColor = "#b7ffc4";
    };
};

async function Next(n) {
    let FirstDiv = document.getElementById("FirstDiv");
    let LastDiv = document.getElementById("LastDiv");

    let MobileDiv = document.getElementById("MobileDiv");
    let EmailDiv = document.getElementById("EmailDiv");

    let GenderDiv = document.getElementById("GenderDiv");
    let DOBDiv = document.getElementById("DOBDiv");
    
    let CreateDiv = document.getElementById("CreateDiv");
    let ConfirmDiv = document.getElementById("ConfirmDiv");

    let Next_DivBtn = document.getElementById("Next_DivBtn");
    let TitleDivH3 = document.getElementById("TitleDivH3");

    let First_Name = document.getElementById("First_Name");
    let Last_Name = document.getElementById("Last_Name");

    let Mobile_Number = document.getElementById("Mobile_Number");
    let Email = document.getElementById("Email");

    let Gender = document.getElementById("Gender");
    let DOB = document.getElementById("DOB");

    let Create_Password = document.getElementById("Create_Password");
    let Confirm_Password = document.getElementById("Confirm_Password");
    if(n==1){
        if (First_Name.value.length < 3 || First_Name.value == null) {
            Message("First name can not be empty.","Warning")
        }else if ( Last_Name.value == null|| Last_Name.value.length < 3) {
            Message("Last name can not be empty.","Warning")
        }else{
            FirstDiv.style.display = "none";
            LastDiv.style.display = "none";
            MobileDiv.style.display = "block";
            EmailDiv.style.display = "block";
            
            Next_DivBtn.style.justifyContent = "space-between";
            Next_DivBtn.innerHTML = `
                <button id="Next_Btn1" type="button" onclick="Back(0)">Back</button>
                <button id="Next_Btn" type="button" onclick="Next(2)">Next</button>
            `;
            
            TitleDivH3.innerHTML = "Enter your contact details";
        }
    }else if(n==2){
        
        if (String(Mobile_Number.value) == null || !validatePhoneNumber(Mobile_Number.value)) {
            Message("Please enter correct mobile number.","Warning")

        }else if (!Valid_Email(Email.value)) {
            Message("Please enter correct email.","Warning")
        }else{
            MobileDiv.style.display = "none";
            EmailDiv.style.display = "none";
            GenderDiv.style.display = "block";
            DOBDiv.style.display = "block";
            Next_DivBtn.innerHTML = `<button id="Next_Btn" type="button" onclick="Next(2)">Next</button>`;
            
            Next_DivBtn.style.justifyContent = "space-between";
            Next_DivBtn.innerHTML = `
            <button id="Next_Btn1" type="button" onclick="Back(1)">Back</button>
            <button id="Next_Btn" type="button" onclick="Next(3)">Next</button>
            `;
            TitleDivH3.innerHTML = "Enter your basic details";
        }
    }else if(n==3){
        // console.log(DOB.value);
        if (Gender.value.length < 3 || Gender.value == null || Gender.value == "") {
            Message("Please select your gender.","Warning")
        }else if ( DOB.value == null|| DOB.value.length < 6) {
            Message("Please enter correct date","Warning")
        }else{
            GenderDiv.style.display = "none";
            DOBDiv.style.display = "none";
            CreateDiv.style.display = "block";
            ConfirmDiv.style.display = "block";
            Next_DivBtn.innerHTML = `<button id="Next_Btn" type="button" onclick="Next(2)">Next</button>`;
            
            Next_DivBtn.style.justifyContent = "space-between";
            Next_DivBtn.innerHTML = `
            <button id="Next_Btn1" type="button" onclick="Back(2)">Back</button>
            <button id="Next_Btn" type="button" onclick="Next(100)">Continue</button>
            `;
            TitleDivH3.innerHTML = "Create password";
        }
    }else if (n == 100){
        let Next_Btn = document.getElementById("Next_Btn");
        Next_Btn.disabled = true;
        if(!Valid_Password(Create_Password.value)){
            Next_Btn.disabled = false;
            Message("Password must contain at least 8 character, symbols, alphabets (Lowercase and uppercase) and numbers","Warning");
        }else if(Confirm_Password.value !== Create_Password.value){
            Next_Btn.disabled = false;
            Message("Password doesn't match.","Warning");
        }else{
            Next_Btn.disabled = true;
            Message("Please wait","Success");

            document.getElementById("Loading").style.display = "flex";
            const Sent = {
                First_Name : First_Name.value,
                Last_Name : Last_Name.value,
                Mobile_Number : Mobile_Number.value,
                Email : Email.value,
                Gender : Gender.value,
                DOB : DOB.value,
                Password : Confirm_Password.value,
            };

            await fetch("/api/v1/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Sent),
            }).then(response=>{
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
                    window.location.href = "/verify/otp";
                }, 2500);
            }).catch(e=>{
                if (e.Message) {
                    let Next_Btn = document.getElementById("Next_Btn");
                    Next_Btn.disabled = false;
                    Message(e.Message,"Warning");
                }else{
                    Message("Connection error","Warning");

                }

            });
            


        };
    };
};
















function Back(n) {
    let FirstDiv = document.getElementById("FirstDiv");
    let LastDiv = document.getElementById("LastDiv");

    let MobileDiv = document.getElementById("MobileDiv");
    let EmailDiv = document.getElementById("EmailDiv");

    let GenderDiv = document.getElementById("GenderDiv");
    let DOBDiv = document.getElementById("DOBDiv");
    
    let CreateDiv = document.getElementById("CreateDiv");
    let ConfirmDiv = document.getElementById("ConfirmDiv");

    let Next_DivBtn = document.getElementById("Next_DivBtn");
    let TitleDivH3 = document.getElementById("TitleDivH3");
    if(n==0){
        FirstDiv.style.display = "block";
        LastDiv.style.display = "block";
        MobileDiv.style.display = "none";
        EmailDiv.style.display = "none";
        
        Next_DivBtn.style.justifyContent = "space-between";
        Next_DivBtn.innerHTML = `
            <button id="Next_Btn1" type="button" onclick="window.location.replace('/login')">Already Have and account?</button>
            <button id="Next_Btn" type="button" onclick="Next(1)">Next</button>
        `;
        
        TitleDivH3.innerHTML = "Enter your name";
    }else if(n==1){
        MobileDiv.style.display = "block";
        EmailDiv.style.display = "block";
        GenderDiv.style.display = "none";
        DOBDiv.style.display = "none";
        Next_DivBtn.innerHTML = `<button id="Next_Btn" type="button" onclick="Next(2)">Next</button>`;
        
        Next_DivBtn.style.justifyContent = "space-between";
        Next_DivBtn.innerHTML = `
        <button id="Next_Btn1" type="button" onclick="Back(0)">Back</button>
        <button id="Next_Btn" type="button" onclick="Next(2)">Next</button>
        `;
        TitleDivH3.innerHTML = "Enter your contact details";
     
    }else if(n==2){
        GenderDiv.style.display = "block";
        DOBDiv.style.display = "block";
        CreateDiv.style.display = "none";
        ConfirmDiv.style.display = "none";
        Next_DivBtn.innerHTML = `<button id="Next_Btn" type="button" onclick="Next(2)">Next</button>`;
        
        Next_DivBtn.style.justifyContent = "space-between";
        Next_DivBtn.innerHTML = `
        <button id="Next_Btn1" type="button" onclick="Back(1)">Back</button>
        <button id="Next_Btn" type="button" onclick="Next(3)">Continue</button>
        `;
        TitleDivH3.innerHTML = "Enter your basic details";
    } 
    
    
}




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