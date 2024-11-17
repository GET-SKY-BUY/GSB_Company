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
        const response = await fetch('/api/v1/cart/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ID: ID,
            }),
        });

        if (response.status === 200) {
            const data = await response.json();
            Message(data.Message, "Success");
            document.getElementById(`Cart_Number_${n}`).remove();

            
            let a = document.getElementById("CartNumber");
            let b = document.getElementById("CartNumber1");
            a.innerHTML = data.N;
            b.innerHTML = data.N;
        }
    } catch (error) {
        Message("Failed to remove cart", "Error");
    }

}