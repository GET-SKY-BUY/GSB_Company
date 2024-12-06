(async () => {
    PRODUCT_LIST = await call(window.innerWidth, "Section1");
    console.log(PRODUCT_LIST);
})();
(async () => {
    PRODUCT_LIST = await call(window.innerWidth, "Section2");
    console.log(PRODUCT_LIST);
})();