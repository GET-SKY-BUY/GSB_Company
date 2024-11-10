(async () => {
    PRODUCT_LIST = await call(window.innerWidth, "Section1");
    console.log(PRODUCT_LIST);
})();