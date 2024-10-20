

async function call(n) {
    
    let d = {
        Width: n,
    }
    fetch("/products/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(d),
    }).then(res=>{
        if(res.ok){
            return res.json();
        }else if(res.status == 307){
            window.location.href = "/login";
        }else{
            return res.json().then((data) => {
                let error = new Error(data.Message);
                error.Message = data.Message;
                throw error;
            });
        }
    }).then(data=>{
        // Message(data.Tags, "Success");
        document.getElementById("Section1").innerHTML = data.Tags;


    }).catch(err=>{
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
    });
    
}
call(window.innerWidth);