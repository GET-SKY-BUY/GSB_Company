





const Valid_Email = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};
const Valid_Mobile = (mobile) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(mobile);
};
const Valid_Password = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};





function EditBtn() {
    // const EditBtn = document.getElementById("EditBtn");
    const EditBtn = document.getElementsByClassName("Btns")[0];
    EditBtn.innerHTML = `<button id="EditBtn" onclick="Save();" type="button">Save</button>`;
    
    // EditBtn.disabled = true;
    const First_Name = document.getElementById("First_Name");
    const Last_Name = document.getElementById("Last_Name");
    const Mobile_Number = document.getElementById("Mobile_Number");
    const DOB = document.getElementById("DOB");
    const Gender = document.getElementById("Gender");
    First_Name.disabled = false;
    Last_Name.disabled = false;
    Mobile_Number.disabled = false;
    DOB.disabled = false;
    Gender.disabled = false;
    
};


function Save() {
    document.getElementById("Loading").style.display = "flex";
    const EditBtn = document.getElementById("EditBtn");
    EditBtn.disabled = true;
    
    const First_Name = document.getElementById("First_Name").value;
    const Last_Name = document.getElementById("Last_Name").value;
    const Mobile_Number = document.getElementById("Mobile_Number").value;
    const DOB = document.getElementById("DOB").value;
    const Gender = document.getElementById("Gender").value;

    function Validation(First_Name, Last_Name, Mobile_Number, Gender, DOB) {
                
        if (First_Name == null || First_Name.length < 3) {
            return "Please enter a valid first name";
        }else if ( Last_Name == null || Last_Name.length < 3) {
            return "Please enter a valid last name";
        }else if (String(Mobile_Number) == null || !Valid_Mobile(String(Mobile_Number))) {
            return "Please enter a valid mobie number";
        }else if (Gender.length < 3 || Gender == null || Gender == "") {
            return "Please enter a gender";
        }else if ( DOB == null|| DOB.length < 6) {
            return "Please enter correct DOB";
        }else{
            return "Valid";
        };
    };
    const Check = Validation(First_Name, Last_Name, Mobile_Number, Gender, DOB);
    
    if (Check === "Valid") {
        
        const X = {
            First_Name: First_Name,
            Last_Name: Last_Name,
            Mobile_Number: Mobile_Number,
            DOB: DOB,
            Gender: Gender,
        };
        fetch("/api/v1/profile/settings", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(X)
        }).then(async response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(Error_Data => {
                    const error = new Error(Error_Data.Message);
                    error.Message = Error_Data.Message;
                    throw error;
                });
            }        
        }).then((data) => {
            
            const EditBtn = document.getElementById("EditBtn");
            EditBtn.disabled = false;

            document.getElementById("Loading").style.display = "none";
            Message(data.Message, "Success");
            const First_Name = document.getElementById("First_Name");
            const Last_Name = document.getElementById("Last_Name");
            const Mobile_Number = document.getElementById("Mobile_Number");
            const DOB = document.getElementById("DOB");
            const Gender = document.getElementById("Gender");
            First_Name.disabled = true;
            Last_Name.disabled = true;
            Mobile_Number.disabled = true;
            DOB.disabled = true;
            Gender.disabled = true;
            
            const EditBtn1 = document.getElementsByClassName("Btns")[0];
            EditBtn1.innerHTML = `<button id="EditBtn" onclick="EditBtn();" type="button">Edit</button>`;

        }).catch((error) => {
            const EditBtn = document.getElementById("EditBtn");
            EditBtn.disabled = false;
            document.getElementById("Loading").style.display = "none";

            if (error.Message) {
                Message(error.Message, "Warning");
                
            }else{
                Message("Something went wrong, please try again later.", "Warning");
            };
        });
    }else{
        document.getElementById("Loading").style.display = "none";
        const EditBtn = document.getElementById("EditBtn");
        EditBtn.disabled = false;
        Message(Check, "Warning");
    };
}


function ChangePassword() {
    document.getElementById("ChangeHideee1").style.display = 'none';
    document.getElementById("ChangeHideee22").style.display = 'block'; 
    
}
function Cancel() {
    document.getElementById("ChangeHideee22").style.display = 'none';
    document.getElementById("ChangeHideee1").style.display = 'block'; 
    
}



function Edit_Bank() {
    // document.getElementById("Loading").style.display = "flex";
    const Bank_Name = document.getElementById("Bank_Name");
    const Beneficiary_Name = document.getElementById("Beneficiary_Name");
    const Account_Number = document.getElementById("Account_Number");
    const IFSC_Code = document.getElementById("IFSC_Code");
    Bank_Name.disabled = false;
    Beneficiary_Name.disabled = false;
    Account_Number.disabled = false;
    IFSC_Code.disabled = false;
    const Edit_BankDiv = document.getElementById("Edit_BankDiv");
    Edit_BankDiv.innerHTML = `<button id="Edit_Bank" onclick="UpdateBank();" type="button">Update Bank</button>`;
    
}


async function UpdateBank() {

    
    const Bank_Name = document.getElementById("Bank_Name");
    const Beneficiary_Name = document.getElementById("Beneficiary_Name");
    const Account_Number = document.getElementById("Account_Number");
    const IFSC_Code = document.getElementById("IFSC_Code");
    const V_Bank_Name = Bank_Name.value;
    const V_Beneficiary_Name = Beneficiary_Name.value;
    const V_Account_Number = Account_Number.value;
    const V_IFSC_Code = IFSC_Code.value;

    
    if (V_Bank_Name == "" || V_Beneficiary_Name == "" || V_Account_Number == "" || V_IFSC_Code == "") {
        Message("Please fill all the fields", "Warning");
    }else if (V_Bank_Name.length < 9) {
        Message("Please enter a valid Bank Name", "Warning");
    }else if (V_Account_Number.length < 9) {
        Message("Please enter a valid account number", "Warning");
    }else if (V_Beneficiary_Name.length < 4) {
        Message("Please enter a valid IFSC Code", "Warning");
    }else if (V_IFSC_Code.length < 9) {
        Message("Please enter a valid IFSC Code", "Warning");
    }else{
        document.getElementById("Loading").style.display = "flex";
        const Edit_Bank = document.getElementById("Edit_Bank");
        Edit_Bank.disabled = true;
        const X = {
            Bank_Name: V_Bank_Name,
            Beneficiary_Name: V_Beneficiary_Name,
            Account_Number: V_Account_Number,
            IFSC_Code: V_IFSC_Code
        };
        await fetch("/api/v1/profile/update_bank", {
            method:"PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(X)
        }).then(async response => {
            
            const Edit_BankDiv = document.getElementById("Edit_BankDiv");
            Edit_BankDiv.innerHTML = `<button id="Edit_Bank" onclick="Edit_Bank();" type="button">Edit Bank details</button>`;
            
            document.getElementById("Loading").style.display = "none";
            const Edit_Bank = document.getElementById("Edit_Bank");
            Edit_Bank.disabled = false;

            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(Error_Data => {
                    const error = new Error(Error_Data.Message);
                    error.Message = Error_Data.Message;
                    throw error;
                });
            };

        }).then(data=>{
            Message(data.Message, "Success");
            
            Bank_Name.disabled = true;
            Beneficiary_Name.disabled = true;
            Account_Number.disabled = true;
            IFSC_Code.disabled = true;

        }).catch(e=>{

            if (e.Message) {
                Message(e.Message, "Warning");
            }else{
                Message("Something went wrong, please try again later.", "Warning");
            }
        });
    };
};





function Current_Password(n) {
    let Current_Password = document.getElementById("Current_Password");
    if (n == 1) {
        Current_Password.type = "text";
        document.getElementById("ShowPassword").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick1" onclick="Current_Password(2);">visibility</span>`;
        
    }else{
        
        document.getElementById("ShowPassword").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick1" onclick="Current_Password(1);">visibility_off</span>`;
        Current_Password.type = "password";
    };
};

function New_Password(n) {
    let New_Password = document.getElementById("New_Password");
    if (n == 1) {
        New_Password.type = "text";
        document.getElementById("ShowPassword1").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick2" onclick="New_Password(2);">visibility</span>`;
    }else{
        document.getElementById("ShowPassword1").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick2" onclick="New_Password(1);">visibility_off</span>`;
        New_Password.type = "password";
    };
};

function ChangePasswordConfirm(){
    let Current_Password = document.getElementById("Current_Password");
    let New_Password = document.getElementById("New_Password");
    let Confirm_Password = document.getElementById("Confirm_Password");
    const Value_Current_Password = Current_Password.value.trim();
    const Value_New_Password = New_Password.value.trim();
    const Value_Confirm_Password = Confirm_Password.value.trim();
    if (Value_Current_Password == "" || Value_New_Password == "" || Value_Confirm_Password == "") {
        Message("Please fill all the fields", "Warning");
    }else if (Value_New_Password != Value_Confirm_Password) {
        Message("New password and confirm password doesn't match", "Warning");
    }else if (!Valid_Password(Value_New_Password)) {
        console.log(!Valid_Password(Value_New_Password),Value_New_Password)
        Message("Password must include symbol, alphabets (Uppercase & Lowercase), digits and minimum 8 characters.", "Warning");
    }else{
        document.getElementById("ChangePasswordConfirm").disabled = true;
        document.getElementById("Loading").style.display = "flex";
        const X = {
            Current_Password: Value_Current_Password,
            New_Password: Value_New_Password,
        };
        fetch("/api/v1/auth/change-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(X)
        }).then(async response => {
            document.getElementById("ChangePasswordConfirm").disabled = false;
            document.getElementById("Loading").style.display = "none";
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(Error_Data => {
                    const error = new Error(Error_Data.Message);
                    error.Message = Error_Data.Message;
                    throw error;
                });
            };
        }).then(data => {
            Message(data.Message, "Success");
            document.getElementById("ChangeHideee22").style.display = "none";
            document.getElementById("ChangeHideee1").style.display = "block";
            document.getElementById("Current_Password").value = "";
            document.getElementById("New_Password").value = "";
            document.getElementById("Confirm_Password").value = "";
        }).catch(e => {
            if (e.Message) {
                Message(e.Message, "Warning");
            }else{
                Message("Connection error", "Warning");
            };
        });
    };
};