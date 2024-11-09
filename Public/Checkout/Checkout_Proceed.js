



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

function Final_Button(Payment_Method) {
    if(Payment_Method == "UPI") {
        // UPI Payment
    } else if(Payment_Method == "COD") {
        // COD Payment
        fetch("/api/v1/checkout/proceed/cod", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Payment_Method: "COD",
            }),
        }).then(response => {
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