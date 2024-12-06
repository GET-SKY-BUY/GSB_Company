"use strict";
document.getElementById("Profile_List").addEventListener("mouseover",()=>{
    document.getElementById("Profile_Box").style.display = "flex";
    document.getElementById("Profile_Box").style.animationName = "ProfileDown";
});
document.getElementById("Profile_List").addEventListener("mouseout",()=>{
    document.getElementById("Profile_Box").style.animationName = "ProfileUp";
});
document.getElementById("More_List").addEventListener("mouseover",()=>{
    document.getElementById("More_Box").style.display = "flex";
    document.getElementById("More_Box").style.animationName = "MoreDown";    
});
document.getElementById("More_List").addEventListener("mouseout",()=>{
    document.getElementById("More_Box").style.animationName = "MoreUp";    
});

function InnerText(n){
    let txt = document.getElementById(`Inner_${n}`).innerHTML;
    document.getElementById("Search_Input").value = txt;
    document.getElementById("Submit_Button").click();
}

function UpArrow(n){
    let txt = document.getElementById(`Inner_${n}`).innerHTML;
    document.getElementById("Search_Input").value = txt;
}

let Selection1 = -1;

document.getElementById("Search_Input").addEventListener("keydown", (key) => {
    let len = document.getElementsByClassName("SearchBI").length;
    let Ob = [];
    for (let index = 0; index < len; index++) {
        Ob.push(index);
    }
    if (key.keyCode == 40) {
        key.preventDefault();
        Selection1 = Selection1 + 1;
        if (Selection1 >= Ob.length) {
            Selection1 = Ob[0];
        }
    }else if(key.keyCode == 38){
        key.preventDefault();
        Selection1 = Selection1 - 1;
        if (Selection1 < 0) {
            Selection1 = Ob[Ob.length-1]            
        }
    } else {
        Selection1 = -1;
        let doc = document.getElementsByClassName("SearchBI");
        for (let o = 0; o < doc.length; o++) {
            let elem = doc[o];
            elem.style.backgroundColor = "white";
        }
        return;
    }
    let doc = document.getElementsByClassName("SearchBI");
    for (let o = 0; o < doc.length; o++) {
        let elem = doc[o];
        elem.style.backgroundColor = "white";
    }
    let box = doc[Selection1];
    box.style.background = "#eeeeee";
    let txt = document.getElementById(`Inner_${Selection1+1}`).textContent;
    document.getElementById("Search_Input").value = txt;
})


function Search_Insert(AA,b = null,c = null,d = null,e = null,f = null) {
    let a = `
    <div class="SearchBI">
    <div onclick="InnerText(${1});" class="search_Icon"><span class="material-symbols-outlined">search</span></div>
    <div onclick="InnerText(${1});" class="Inner_text"><span class="Innnnnn" id="Inner_${1}">${AA}</span></div>
    <div onclick="UpArrow(${1});" class="UpperArrow"><span class="material-symbols-outlined">north_west</span></div>
    </div>`;
    if (b != null) {
        a += `
        <div class="SearchBI">
        <div onclick="InnerText(${2});" class="search_Icon"><span class="material-symbols-outlined">search</span></div>
        <div onclick="InnerText(${2});" class="Inner_text"><span class="Innnnnn" id="Inner_${2}">${b}</span></div>
        <div onclick="UpArrow(${2});" class="UpperArrow"><span class="material-symbols-outlined">north_west</span></div>
        </div>`;
    }
    if (c != null) {
        a += `
        <div class="SearchBI">
        <div onclick="InnerText(${3});" class="search_Icon"><span class="material-symbols-outlined">search</span></div>
        <div onclick="InnerText(${3});" class="Inner_text"><span class="Innnnnn" id="Inner_${3}">${c}</span></div>
        <div onclick="UpArrow(${3});" class="UpperArrow"><span class="material-symbols-outlined">north_west</span></div>
        </div>`;
    }
    if (d != null) {
        a += `
        <div class="SearchBI">
        <div onclick="InnerText(${4});" class="search_Icon"><span class="material-symbols-outlined">search</span></div>
        <div onclick="InnerText(${4});" class="Inner_text"><span class="Innnnnn" id="Inner_${4}">${d}</span></div>
        <div onclick="UpArrow(${4});" class="UpperArrow"><span class="material-symbols-outlined">north_west</span></div>
        </div>`;
    }
    if (e != null) {
        a += `
        <div class="SearchBI">
        <div onclick="InnerText(${5});" class="search_Icon"><span class="material-symbols-outlined">search</span></div>
        <div onclick="InnerText(${5});" class="Inner_text"><span class="Innnnnn" id="Inner_${5}">${e}</span></div>
        <div onclick="UpArrow(${5});" class="UpperArrow"><span class="material-symbols-outlined">north_west</span></div>
        </div>`;
    }
    if (f != null) {
        a += `
        <div class="SearchBI">
        <div onclick="InnerText(${6});" class="search_Icon"><span class="material-symbols-outlined">search</span></div>
        <div onclick="InnerText(${6});" class="Inner_text"><span class="Innnnnn" id="Inner_${6}">${f}</span></div>
        <div onclick="UpArrow(${6});" class="UpperArrow"><span class="material-symbols-outlined">north_west</span></div>
        </div>`;   
    }
    document.getElementById("SearchResult").innerHTML = a;
}


Search_Insert("");

document.getElementById("Search_Input").addEventListener("input", ()=>{
    document.getElementById("SearchResult").style.display ="block";
});
document.addEventListener("click",()=>{document.getElementById("SearchResult").style.display ="none";})




function NavClicked(n) {
    if (n == 1) {   
        window.open("/store_shops");
    }else if (n == 4) {
        window.open("/profile/favourite");
        
    }else if (n == 98) {
        window.open("/profile/setting");

    }else if (n == 99) {
        window.open("/");

    }else if (n == 5) {
        window.open("/checkout/cart");
        
    }
    
}







function CloseMenu() {
    // document.getElementById("Nav").style.display = "none";
    document.getElementById("Nav").style.animationName = "NavOut";
    // document.getElementById("BackgroundBlur").style.animationName = "BackgroundBlurBack";
    // document.getElementById("BackgroundBlur").style.display = "none";
    
}
function OpenMenu() {
    BackgroundBlur();
    document.getElementById("Nav").style.display = "inline-block";
    document.getElementById("Nav").style.animationName = "NavIn";
}


function BackgroundBlur() {
    document.getElementById("BackgroundBlur").style.animationName = "BackgroundBlur";
    document.getElementById("BackgroundBlur").style.display = "block";
    document.getElementById("BackgroundBlur").addEventListener("click",()=>{
        document.getElementById("BackgroundBlur").style.animationName = "BackgroundBlurBack";
        // document.getElementById("BackgroundBlur").style.display = "none";
        CloseMenu();
    });
    
}







