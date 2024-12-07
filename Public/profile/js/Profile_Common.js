

if(window.innerWidth < 571) {
    document.getElementById("Profile_BTN").addEventListener("click", function() {

        if(document.getElementById("Profile_BTN").innerHTML == "close") {
            document.getElementById("Side1").style.right = "-182px";
            document.getElementById("Profile_BTN").innerText = "menu";
            document.getElementById("Profile_BTN").style.left = "-60px";

        }else{
            document.getElementById("Side1").style.right = "0px";
            document.getElementById("Profile_BTN").innerText = "close";
            document.getElementById("Profile_BTN").style.left = "120px";
        };
    });
    
};