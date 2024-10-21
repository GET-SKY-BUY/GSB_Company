const Edit = (ID,n) => {
    let AddressCard = `Card_${n}`;
    document.getElementById("Aside1").style.display = "flex";
    
    document.getElementById("Edit_Btn1").innerHTML = `
        <button id="EditFinal" onclick="EditFinal1('${ID}');" type="button">Edit Address</button>
    `;

    let A = document.getElementById(AddressCard).querySelectorAll("div");
    document.getElementById("Edit_Name").value = A[2].innerHTML;
    document.getElementById("Edit_Mobile_Number").value = A[3].innerHTML;
    document.getElementById("Edit_Alternative_Number").value = A[4].innerHTML.split(" - ")[0];
    document.getElementById("Edit_Landmark").value = A[6].innerHTML;
    document.getElementById("Edit_Address_Line").innerText = A[7].innerHTML;

    setTimeout(() => {
        document.getElementById("Edit_PIN").value = A[5].innerHTML.split(",")[0];
    }, 50);


};

function EditFinal1 (ID) {
    
    if(!confirm("Are you sure to edit this address?")) {
        return;
    }
    document.getElementById("Loading").style.display = "flex";
    Message("Updating, please wait...","Info");
    fetch("/api/v1/profile/address",{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ID: ID,
            Name: document.getElementById("Edit_Name").value,
            Mobile_Number: document.getElementById("Edit_Mobile_Number").value,
            Alternative_Number: document.getElementById("Edit_Alternative_Number").value,
            PIN: document.getElementById("Edit_PIN").value,
            Address_Line: document.getElementById("Edit_Address_Line").value,
            Landmark: document.getElementById("Edit_Landmark").value,
        })
    }).then(res=>{
        document.getElementById("Loading").style.display = "none";
        if(res.ok) {
            return res.json();
        }else {
            return res.json().then(data=>{
                let error = new Error(data.Message || "An error occured. Please try again later");
                error.Message = data.Message;
                throw error;
            });
        };
    }).then(data=>{
        Message(data.Message, "Success");
        
        document.getElementById("Aside1").style.display = "none";
        setTimeout(() => {
            location.reload();
        }, 1000);
    }).catch(err=>{
        if(err.Message) {
            Message(err.Message, "Warning");
        }else{
            Message("An error occured. Please try again later")
        };
    });
}




function Add_Final_Submit(){
    document.getElementById("Add_Final_BTN").disabled = true;



    if(
        document.getElementById("Name").value.length < 3 ||
        document.getElementById("Mobile_Number").value.length != 10 ||
        document.getElementById("Alternative_Number").value.length != 10 ||
        document.getElementById("PIN").value.length < 3 ||
        document.getElementById("Address_Line").value.length < 3 ||
        document.getElementById("Landmark").value.length < 3
    ){
        Message("Please fill all fields","Warning");
        return;
    }
    fetch("/api/v1/profile/address",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Name: document.getElementById("Name").value,
            Mobile_Number: document.getElementById("Mobile_Number").value,
            Alternative_Number: document.getElementById("Alternative_Number").value,
            PIN: document.getElementById("PIN").value,
            Address_Line: document.getElementById("Address_Line").value,
            Landmark: document.getElementById("Landmark").value,
        })
    }).then(res=>{
        
        document.getElementById("Add_Final_BTN").disabled = false;
        if(res.ok) {
            return res.json();
        }else {
            return res.json().then(data=>{
                let error = new Error(data.Message || "An error occured. Please try again later");
                error.Message = data.Message;
                throw error;
            });
        }
    }).then(data=>{
        Message(data.Message, "Success");
        document.getElementById("Aside").style.display = "none";
        document.getElementById("Aside_Form").reset();
    }).catch(err=>{
        console.log(err);
        if(err.Message) {
            Message(err.Message, "Warning");
        }else{
            Message("An error occured. Please try again later")
        }
    });
};





const Verify_Code = async code =>{
    if(!code || code == "" || code.length !== 6) {
        Message("Invalid code","Warning");
        return;
    };
    let Ret = null;
    await fetch(`/api/v1/additional/pincode/${code}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    }).then( async (res) => {
        if(res.status == 200) {
            return res.json();
        }else{
            return res.json().then( (data) => {
                let error = new Error(data.Message || "An error occured. Please try again later");
                error.Message = data.Message;
                throw error;
            });
        }
    }).then( data => {
        Ret = data;
    }).catch( (err) => {
        console.log(err);
        if(err.Message) {
            Message(err.Message, "Warning");
        }else{
            Message("An error occured. Please try again later")
        }
    })
    return Ret;
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("Aside_Close").addEventListener("click", () => {
        document.getElementById("Aside").style.display = "none";
        document.getElementById("Aside_Form").reset();
    });
    document.getElementById("Aside_Close1").addEventListener("click", () => {
        document.getElementById("Aside1").style.display = "none";
        document.getElementById("Aside_Form1").reset();
    });
    
    document.getElementById("CreateAddressBtn").addEventListener("click", () => {
        document.getElementById("Aside").style.display = "flex";
    });


    document.getElementById("PIN").addEventListener("input", async (e) => {
        let code = e.target.value;
        if(code.length == 6) {
            let data = await Verify_Code(code);
            if(!data) {
                return;
            }
            document.getElementById("Town").innerHTML = data.Town;
            document.getElementById("State_Country").innerHTML = data.State + ", " + data.Country;
            
        };
        
    });
    document.getElementById("Edit_PIN").addEventListener("input", async (e) => {
        let code = e.target.value;
        if(code.length == 6) {
            let data = await Verify_Code(code);
            if(!data) {
                return;
            }
            document.getElementById("Town1").innerHTML = data.Town;
            document.getElementById("State_Country1").innerHTML = data.State + ", " + data.Country;
            
        };
        
    });
});

const Delete = (ID,n) => {

    if(!confirm("Are you sure you want to delete this address?")) {
        return;
    }
    let Delete_ID = `Delete_${n}`;
    document.getElementById(Delete_ID).disabled = true;
    document.getElementById("Loading").style.display = "flex";
    Message("Deleting, please wait...","Info");
    fetch("/api/v1/profile/address",{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ID: ID,
        })
    }).then(res=>{
        document.getElementById("Loading").style.display = "none";
        if(res.ok) {
            return res.json();
        }else {
            return res.json().then(data=>{
                let error = new Error(data.Message || "An error occured. Please try again later");
                error.Message = data.Message;
                throw error;
            });
        };
    }).then(data=>{
        Message(data.Message, "Success");
        document.getElementById(Delete_ID).disabled = false;
        document.getElementById(`Card_${n}`).remove();
    }).catch(err=>{
        if(err.Message) {
            Message(err.Message, "Warning");
        }else{
            Message("An error occured. Please try again later")
        };
    });
};

const Set = (ID,n) => {

    let Element = `Set_${n}`;
    document.getElementById(Element).disabled = true;
    document.getElementById("Loading").style.display = "flex";
    Message("Activating address, please wait...","Info");
    fetch("/api/v1/profile/address",{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ID: ID,
        })
    }).then(res=>{
        document.getElementById(Element).disabled = false;
        document.getElementById("Loading").style.display = "none";
        if(res.ok) {
            return res.json();
        }else {
            return res.json().then(data=>{
                let error = new Error(data.Message || "An error occured. Please try again later");
                error.Message = data.Message;
                throw error;
            });
        };
    }).then(data=>{
        Message(data.Message, "Success");
        setTimeout(() => {
            location.reload();
        }, 100);
    }).catch(err=>{
        if(err.Message) {
            Message(err.Message, "Warning");
        }else{
            Message("An error occured. Please try again later")
        };
    });
};
