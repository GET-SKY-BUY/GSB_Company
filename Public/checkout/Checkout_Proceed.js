



document.getElementById("UPI").addEventListener("click", function() {
    document.getElementById("Final_Payment_Button").innerHTML = `
        
        <button type="button" onclick="Final_Button('UPI')">Pay now</button>
    
    `;
});
document.getElementById("COD").addEventListener("click", function() {
    document.getElementById("Final_Payment_Button").innerHTML = `
        
        <button type="button" onclick="Final_Button('COD')">Place order</button>
    `;
});



async function Verify_Signature(Response){
    console.log('a')
    document.getElementById("Loading").style.display = "flex";
    fetch("/api/v1/checkout/proceed/signature", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Response),
    }).then(response => {
        document.getElementById("Loading").style.display = "none";
        if(response.status == 200) {
            return response.json();
        };
        return response.json().then(data => {
            let E = new Error(data.Message);
            E.Message = data.Message;
            throw E;
        });
    }).then(data => {
        Message(data.Message, "Success");
        setTimeout(() => {
            window.location.href = "/profile/orders";
        }, 1200);
    }).catch(error => {
        if(error.Message){
            Message(error.Message, "Warning");
        } else {
            Message("Failed to place order", "Warning");
        }
    });
};




function Final_Button(Payment_Method) {
    if(Payment_Method == "UPI") {
        // UPI Payment
        document.getElementById("Loading").style.display = "flex";
        fetch("/api/v1/checkout/proceed/pay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Payment_Method: "UPI",
            }),
        }).then(response => {
            
            document.getElementById("Loading").style.display = "none";
            if(response.status == 200) {
                return response.json();
            };
            return response.json().then(data => {
                let E = new Error(data.Message);
                E.Message = data.Message;
                throw E;
            });
        }).then(data => {
            Message(data.Message, "Success");
            console.log(data.Option_For_Order);
            let Opt = data.Option_For_Order;
            Opt["handler"] = Verify_Signature;
            setTimeout(() => {
                const rzp = new Razorpay(Opt);
                rzp.open();
                rzp.on('payment.failed', Payment_Failed);
            }, 1000);
        }).catch(error => {
            console.log(error);
            if(error.Message){
                Message(error.Message, "Warning");
            } else {
                Message("Failed to place order.", "Warning");
            };
        });


    } else if(Payment_Method == "COD") {
        
        // COD Payment
        document.getElementById("Loading").style.display = "flex";
        fetch("/api/v1/checkout/proceed/cod", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Payment_Method: "COD",
            }),
        }).then(response => {
            
            document.getElementById("Loading").style.display = "none";
            if(response.status == 200) {
                return response.json();
            };
            return response.json().then(data => {
                let E = new Error(data.Message);
                E.Message = data.Message;
                throw E;
            });
        }).then(data => {
            Message(data.Message, "Success");
            setTimeout(() => {
                window.location.href = "/profile/orders";
            }, 1200);
        }).catch(error => {
            if(error.Message){
                Message(error.Message, "Warning");
            } else {
                Message("Failed to place order", "Warning");
            }
        });
    };
};

async function Payment_Failed(response){
    console.log("Payment failed: " + response);
    setTimeout(async () => {
        
        Message("Payment failed, " + response.error.description, "Warning");
        
        document.getElementById("Loading").style.display = "flex";
        await fetch("/api/v1/checkout/proceed/payment_failed", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
        }).then(response => {
            
            document.getElementById("Loading").style.display = "none";
            if(response.status == 200) {
                return response.json();
            };
            return response.json().then(data => {
                let E = new Error(data.Message);
                E.Message = data.Message;
                throw E;
            });
        }).then(data => {
            Message(data.Message, "Success");
        }).catch(error => {
            console.log(error);
            if(error.Message){
                Message(error.Message, "Warning");
                return;
            };
            Message("Failed to place order.", "Warning");
        });

    }, 4000);
    
};
