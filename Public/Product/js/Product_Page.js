
window.addEventListener('load', () => {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
});
  
let XXXXXX = `ImageChange${0}`;
document.getElementById("BigImg").innerHTML = `<img src="${document.getElementById(XXXXXX).src}" alt="Product Image">`;
function ImageChange(n) {
    let A = `ImageChange${n}`;
    let B = document.getElementById(A);
    let BigImg = document.getElementById("BigImg");
    BigImg.innerHTML = `<img src="${B.src}" alt="Product Image">`;
};




function NNN() {
    
    let Image_Box1 = document.getElementById("Image_Box");
    Image_Box = window.getComputedStyle(Image_Box1);
    let h = Image_Box.width;
    // console.log(h);
    h = h.split("px")[0];
    h = Number(h)
    
    Image_Box1.style.height = (h - 110) + "px";
    
}
if(window.innerWidth < 831 && window.innerWidth > 440){
    NNN();
};
window.addEventListener("resize", function(){
    if(window.innerWidth < 831 && window.innerWidth > 440){
        NNN();
    };
    
})


function aaa() {
    let SideImge = document.getElementById("SideImge");
    let aa = SideImge.getElementsByTagName("button").length;
    let a = aa * 106;
    SideImge.style.width = a + "px";
}

if (window.innerWidth > 440) {
    document.getElementById("UpArrow").addEventListener("click", ()=>{
        
        let SideImge = document.getElementById("SideImge");
        let AA = window.getComputedStyle(SideImge);
        
        let TotalHeightPresent = (Number(AA.height.split("px")[0]));
        
        let Image_Box = document.getElementById("Image_Box");
        let BB = window.getComputedStyle(Image_Box);
        
        let TotalHeight = Number(BB.height.split("px")[0]);
        
        let a = TotalHeightPresent - TotalHeight;
        let SideImge11 = document.getElementById("SideImge11");
        if(a > 0){
            SideImge11.scrollBy({ top: -100, behavior: 'smooth' });
        }
        
    })
    document.getElementById("DownArrow").addEventListener("click", ()=>{
        
        let SideImge = document.getElementById("SideImge");
        let AA = window.getComputedStyle(SideImge);
        
        let TotalHeightPresent = (Number(AA.height.split("px")[0]));
        
        let Image_Box = document.getElementById("Image_Box");
        let BB = window.getComputedStyle(Image_Box);
        
        let TotalHeight = Number(BB.height.split("px")[0]);
        let a = TotalHeightPresent - TotalHeight;
        let SideImge11 = document.getElementById("SideImge11");
        if(a > 0){
            SideImge11.scrollBy({ top: +100, behavior: 'smooth' });


        }
        
    })
        
}else{
    document.getElementById("UpArrow").addEventListener("click", ()=>{
        
        let SideImge = document.getElementById("SideImge");
        let AA = window.getComputedStyle(SideImge);
        
        let TotalHeightPresent = (Number(AA.width.split("px")[0]));
        
        let Image_Box = document.getElementById("Image_Box");
        let BB = window.getComputedStyle(Image_Box);
        
        let TotalHeight = Number(BB.width.split("px")[0]);
        
        let a = TotalHeightPresent - TotalHeight;
        let SideImge11 = document.getElementById("SideImge11");
        if(a > 0){
            SideImge11.scrollBy({ left: -100, behavior: 'smooth' });
        }
        
    })
    document.getElementById("DownArrow").addEventListener("click", ()=>{
        
        let SideImge = document.getElementById("SideImge");
        let AA = window.getComputedStyle(SideImge);
        
        let TotalHeightPresent = (Number(AA.width.split("px")[0]));
        
        let Image_Box = document.getElementById("Image_Box");
        let BB = window.getComputedStyle(Image_Box);
        
        let TotalHeight = Number(BB.width.split("px")[0]);
        let a = TotalHeightPresent - TotalHeight;
        let SideImge11 = document.getElementById("SideImge11");
        if(a > 0){
            SideImge11.scrollBy({ left: +100, behavior: 'smooth' });


        }
        
    })
    aaa();
    let UpArrow = document.getElementById("UpArrow");
    UpArrow.innerHTML = `<span class="material-symbols-outlined">keyboard_arrow_left</span>`;
    let DownArrow = document.getElementById("DownArrow");
    DownArrow.innerHTML = `<span class="material-symbols-outlined">keyboard_arrow_right</span>`;
    
    let SideImge11 = document.getElementById("SideImge11");
    let width = getComputedStyle(SideImge11).width;
    // console.log(width);
    DownArrow.style.left = (Number( width.split("px")[0])-40) + "px";

}
(async () => {
    PRODUCT_LIST = await call(window.innerWidth, "Section1");
    console.log(PRODUCT_LIST);
})();