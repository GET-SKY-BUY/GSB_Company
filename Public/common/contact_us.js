


async function SubmitB(){
    
    let Name = document.getElementById("Name").value;
    if(Name == "" || Name.length < 3){
        Message("Name is required.", "Error");
        return;
    }
    let Contact_Number = document.getElementById("Contact_Number").value;
    if(Contact_Number == "" || isNaN(Contact_Number) || Contact_Number.length != 10){
        Message("Enter a valid number.", "Error");
        return;
    };
    let Whats_App_Number = document.getElementById("Whats_App_Number").value;
    if(Whats_App_Number == "" || isNaN(Whats_App_Number) || Whats_App_Number.length != 10){
        Message("Enter a valid number", "Error");
        return;
    };
    let Gender = document.getElementById("Gender").value;
    if(Gender == ""){
        Message("Enter a valid Gender", "Error");
        return;
    };
    let Reason = document.getElementById("Reason").value;
    if(Reason == "" ){
        Message("Please tell us, why do you want to contact us?", "Error");
        return;
    };
    if(Reason.length < 21){
        Message("Reason for contact must be at least 20 characters.", "Error");
        return;
    };
    if(Reason.length > 1000){
        Message("Reason for contact must exceed 1000 characters.", "Error");
        return;
    };
    
    let Json = {
        Name,
        Contact_Number,
        Whats_App_Number,
        Gender,
        Reason,
    };
    
    document.getElementById("Loading").style.display = "flex";
    await fetch('/api/v1/control/contact_us', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Json)
    }).then(res =>{
        document.getElementById("Loading").style.display = "none";
        if(res.ok){
            return res.json();            
        };
        if(res.status == 401){
            Message("You are not logged in. Redirecting to login page.", "Error");
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 1000);
            return;
        };
        return res.json().then(data=>{
            let err = new Error(data.Message);
            err.Message = data.Message;
            throw err;
        });
    }).then(data=>{
        document.getElementById("Contact_Us").reset();
        Message(data.Message, "Success");
    }).catch(err=>{
        if(err.Message){
            Message(err.Message, "Error");
            setTimeout(() => {
                location.reload();
            }, 600);
            return;
        };
        Message("Something happened. Please try again later.", "Error");

    });
};