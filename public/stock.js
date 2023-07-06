const itemsDOM = document.querySelector(".items");

//  get data from /api/v1/items
const showItems = async () => {
    try {
        const { data: items }  = await axios.get("/api/v1/items");

       // no items
        if (items.length  < 1) {
            itemsDOM.innerHTML = `<h5 class="emply-list">Itemが見つかりません.</h5>`;
            return;
        }
       
        // output items
        const allItems = items.map((item)=> {
            const {_id, name, quantity, threshold} = item;
            
            return `<div class="single-item">
            <h5>${name} (threshold: ${threshold})</h5>
            <div class="quantity-ctl ${(quantity <= threshold) && "shortage"}" data-id="${_id}" data-threshold=${threshold}>
                <button type="button" class="quantity-btn minus">-</button>
                <div><span class="quantity">${quantity}</span></div>
                <button type="button" class="quantity-btn plus">+</button>
            </div>
        </div>`;
        }).join("");
        itemsDOM.innerHTML = allItems;
    } catch(err) {
        console.log(err);
    }
}
showItems();


itemsDOM.addEventListener("click", async (event) => {
    const elm = event.target;

    if(elm.classList.contains("plus") || elm.classList.contains("minus")) {
        const id = elm.parentElement.dataset.id;
        const quantityElm = elm.parentElement.querySelector(".quantity");
        const quantity = parseInt(quantityElm.innerText);
        const delta = elm.classList.contains("plus") ? 1 : -1;

        try {
            await axios.patch(`/api/v1/items/${id}`, { quantity: quantity + delta });
            showItems();
        } catch (err) {
            console.log(err);
        }
    }
});