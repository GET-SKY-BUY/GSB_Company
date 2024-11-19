function handleMessageKeyFromWindow() {
    const queryString = window.location.search;

    if (queryString) {
        const urlParams = new URLSearchParams(queryString);

        console.log('Parsed Query Parameters:', Object.fromEntries(urlParams.entries()));

        // Check if 'message' key exists
        if (urlParams.has('message')) {
            const message = urlParams.get('message');
            console.log('Message key exists:', message);
            Message(message, "Warning");
        } else {
            console.log('Message key does not exist');
        }
    } else {
        console.log('No query string found');
    }
}


handleMessageKeyFromWindow();







async function Remove_Cart(n, ID) {

    try {
        document.getElementById("Loading").style.display = "flex";
        await fetch('/api/v1/cart/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ID: ID,
            }),
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
            document.getElementById(`Cart_Number_${n}`).remove();

            let a = document.getElementById("CartNumber");
            let b = document.getElementById("CartNumber1");
            a.innerHTML = data.N;
            b.innerHTML = data.N;
        }).catch((err) => {
            if(err.Message){
                Message(err.Message, "Warning");
                return 
            };
            Message("Something went wrong", "Warning");
        });
    } catch (error) {
        
        document.getElementById("Loading").style.display = "none";
        Message("Failed to remove cart", "Warning");
    };
};

async function Option_Change(n, ID) {

    try {
        
        document.getElementById("Loading").style.display = "flex";
        await fetch('/api/v1/cart/update/option', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Option: document.getElementById(`Choose_${n}`).value,
                ID: ID,
            }),
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
            location.reload();
        }).catch((err) => {
            if(err.Message){
                Message(err.Message, "Warning");
                location.reload();
                return 
            };
            Message("Something went wrong", "Warning");
            location.reload();
        });
    } catch (error) {
        
        document.getElementById("Loading").style.display = "none";
        Message("Failed to update option", "Warning");
    };
};


async function Qty_Change(n, ID) {

    try {
        
        document.getElementById("Loading").style.display = "flex";
        await fetch('/api/v1/cart/update/quantity', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Quantity: document.getElementById(`Qt_${n}`).value,
                ID: ID,
            }),
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
            location.reload();
        }).catch((err) => {
            if(err.Message){
                Message(err.Message, "Warning");
                location.reload();
                return 
            };
            Message("Something went wrong", "Warning");
            location.reload();
        });
    } catch (error) {
        
        document.getElementById("Loading").style.display = "none";
        Message("Failed to update option", "Warning");
    };
};

