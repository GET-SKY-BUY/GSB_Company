
let PRODUCT_LIST = [];

async function call(n, Sec, CAT=null) {
    let d;
    if(!CAT){
        d = {
            Width: n,
            PRODUCT_LIST: PRODUCT_LIST,
        };
    }else{

        d = {
            Width: n,
            PRODUCT_LIST: PRODUCT_LIST,
            Categories: CAT,
        };
    };
    
    await fetch("/api/v1/product/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(d),
    }).then(async res=>{
        if(res.ok){
            return res.json();
        };
        return res.json().then((data) => {
            let error = new Error(data.Message);
            error.Message = data.Message;
            throw error;
        });
    }).then(data=>{
        PRODUCT_LIST = [...PRODUCT_LIST, ...data.PRODUCT_LIST];
        document.getElementById(Sec).innerHTML = data.Tags;
    }).catch(err=>{
        if(err.Message){
            Message(err.Message, "Warning");
        }else{
            Message("Something went wrong", "Warning");
        };
    });
    return PRODUCT_LIST;
};
(async () => {
    PRODUCT_LIST = await call(window.innerWidth, "Section1");
    console.log(PRODUCT_LIST);
})();