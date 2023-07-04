const itemsDOM = document.querySelector(".items");

//  get data from /api/v1/items
const showitems = async () => {
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
            <div class="quantity ${(quantity < threshold) && "shortage"}" data-threshold=${threshold}>
                <button type="button" class="quantity-btn minus" data-id="${_id}">
                    -
                </button>
                ${quantity}
                <button type="button" class="quantity-btn plus" data-id="${_id}">
                    +
                </button>
            </div>
        </div>`;
        }).join("");
        itemsDOM.innerHTML = allItems;
    } catch(err) {
        console.log(err);
    }
}




showitems();