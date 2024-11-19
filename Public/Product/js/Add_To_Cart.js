async function AddToCart(n){
    if (n.length < 9) {
        Message("Unauthorized Access", "Warning");
        return;
    }
    let Send = {
        ID: n,
    };
    document.getElementById("Loading").style.display = "flex";
    await fetch("/api/v1/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
    }).then((res) => {
        document.getElementById("Loading").style.display = "none";
        if(res.ok){
            return res.json();
        
        };
        return res.json().then((data) => {
            let error = new Error(data.Message);
            error.Message = data.Message;
            throw error;
        });
    }).then((data) => {
        Message(data.Message, "Success");
        let a = document.getElementById("CartNumber");
        let b = document.getElementById("CartNumber1");
        a.innerHTML = data.Len;
        b.innerHTML = data.Len;
    }).catch((err) => {
        if(err.Message){
            Message(err.Message, "Warning");
            return 
        };
        Message("Something went wrong", "Warning");
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
        
    await fetch("/api/v1/cart/buy_now", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
    }).then((res) => {
        document.getElementById("Loading").style.display = "none";
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
        }, 800);
        
    }).catch((err) => {
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
    });
};

async function Favourite(n){
    // document.getElementById("Buy_Now").disabled = true;
    if (n.length < 8) {
        Message("Unauthorized Access", "Warning");
        return;
    };
    let Send = {
        ID: n,
    };
    
    const IDDD = `Fav_${n}`;
    document.getElementById(IDDD).disabled = true;
    document.getElementById("Loading").style.display = "flex";
        
    await fetch("/api/v1/cart/favourite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
    }).then((res) => {
        document.getElementById("Loading").style.display = "none";
        document.getElementById(IDDD).disabled = false;
        if(res.ok){
            return res.json();
        }
        return res.json().then((data) => {
            let error = new Error(data.Message);
            error.Message = data.Message;
            throw error;
        });
    }).then((data) => {
        document.getElementById(`FavINImage_${n}`).innerHTML =`
        <button id="Fav_${n}" onclick="UnFavourite('${n}')" type="button">
            <img id="Fav_Img${n}" src="/verified/files/images/Fav_Selected.png" alt="Fav icon">
        </button>
        `;
        Message(data.Message, "Success");
    }).catch((err) => {
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
    });
};
async function UnFavourite(n){
    // document.getElementById("Buy_Now").disabled = true;
    if (n.length < 8) {
        Message("Unauthorized Access", "Warning");
        return;
    };
    let Send = {
        ID: n,
    };
    
    const IDDD = `Fav_${n}`;
    document.getElementById(IDDD).disabled = true;
    document.getElementById("Loading").style.display = "flex";
        
    await fetch("/api/v1/cart/favourite/remove", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
    }).then((res) => {
        document.getElementById("Loading").style.display = "none";
        document.getElementById(IDDD).disabled = false;
        if(res.ok){
            return res.json();
        }
        return res.json().then((data) => {
            let error = new Error(data.Message);
            error.Message = data.Message;
            throw error;
        });
    }).then((data) => {
        document.getElementById(`FavINImage_${n}`).innerHTML =`
        <button id="Fav_${n}" onclick="Favourite('${n}')" type="button">
            <img id="Fav_Img${n}" src="/verified/files/images/Fav.png" alt="Fav icon">
        </button>
        `;
        Message(data.Message, "Success");
    }).catch((err) => {
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
    });
};