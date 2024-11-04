async function AddToCart(n){
    if (n.length < 9) {
        Message("Unauthorized Access", "Warning");
        return;
    }
    let Send = {
        ID: n,
    };
    document.getElementById("AddToCart").disabled = true;
    document.getElementById("Loading").style.display = "flex";
    await fetch("/api/v1/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
    }).then((res) => {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("AddToCart").disabled = false;
        if(res.ok){
            return res.json();
        }else{
            return res.json().then((data) => {
                let error = new Error(data.Message);
                error.Message = data.Message;
                throw error;
            });
        }
    }).then((data) => {
        Message(data.Message, "Success");
        let a = document.getElementById("CartNumber");
        let b = document.getElementById("CartNumber1");
        a.innerHTML = data.Len;
        b.innerHTML = data.Len;
        // document.getElementById("Add_To_Cart").disabled = false;

        
    }).catch((err) => {
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
    });
};

async function BuyNow(n){
    // document.getElementById("Buy_Now").disabled = true;
    if (n.length < 8) {
        Message("Unauthorized Access", "Warning");
        return;
    }
    let Send = {
        ID: n,
    };
    document.getElementById("Loading").style.display = "flex";
    document.getElementById("BuyNow").disabled = true;
        
    await fetch("/api/v1/cart/buy_now", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
    }).then((res) => {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("BuyNow").disabled = false;
        if(res.ok){
            return res.json();
        }
        return res.json().then((data) => {
            let error = new Error(data.Message);
            error.Message = data.Message;
            throw error;
        });
    }).then((data) => {
        Message(data.Message, "Success");
        // document.getElementById("Buy_Now").disabled = false;
        setTimeout(() => {
            window.location.href = "/buy_now";
        }, 500);
        
    }).catch((err) => {
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
    });

}

async function Favorite(n){
    // document.getElementById("Buy_Now").disabled = true;
    if (n.length != 8) {
        Message("Unauthorized Access");
        return;
    }
    let Send = {
        ID: n,
    };
    await fetch("/products/favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
    }).then((res) => {
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
    }).then((data) => {
        Message(data.Message, "Success");
        
    }).catch((err) => {
        console.log(err);
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
        // document.getElementById("Buy_Now").disabled = false;
    });

}