function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


window.addEventListener('scroll', () => {
    // if (isElementVisible()) {
        // ifVissible();
    // };
});

async function ifVissible(){
    // for infinite scroll
    // fetch more data
    // append to the page
    // update the page
    console.log("Loading more Products");
    await fetch('/api/v1/products',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },

    });
}







    

