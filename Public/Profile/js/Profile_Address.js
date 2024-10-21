



document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("Aside_Close").addEventListener("click", () => {
        document.getElementById("Aside").style.display = "none";
        document.getElementById("Aside_Form").reset();
    });
    
    document.getElementById("CreateAddressBtn").addEventListener("click", () => {
        document.getElementById("Aside").style.display = "flex";
    });
    
    const Delete = (ID = "",n) => {

        
        if(!ID || ID == "" || !n) {
            Message("No ID provided","Warning");
            return;
        }

        
    }
});