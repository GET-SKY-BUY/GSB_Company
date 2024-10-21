




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
            Message(data.Message, "Success");
        };
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


    
    
    
});

const Delete = (ID = "",n) => {

    
    if(!ID || ID == "" || !n) {
        Message("No ID provided","Warning");
        return;
    }

    
}

