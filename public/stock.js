const itemsDOM = document.querySelector(".items");
const alertDOM = document.querySelector(".alert-box");
const alertListDOM = alertDOM.querySelector(".alert-item-list");


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
            
            return `<div class="single-item ${(quantity <= threshold) && "shortage"}">
            <h5 class="item-name">${name}</h5>
            <div class="quantity-ctl" data-id="${_id}" data-threshold=${threshold}>
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

// show shortage items on top
const showAlertItem = () => {
    alertDOM.style.display = "none";
    const shortageList = Array.from(itemsDOM.children)
    .filter( elm => {
        return elm.classList.contains("shortage");
    });

    if(shortageList.length > 0) {
        const itemNames = shortageList.map(elm => {
            let itemName = elm.querySelector(".item-name").innerText;
            let quantity = elm.querySelector(".quantity").innerText;
            return `<li class="alert-item">${itemName} (残り: ${quantity})</li>`;
        }).join("");
        alertListDOM.innerHTML = itemNames;
        alertDOM.style.display = "block";
    }
}

const dataReload = async () => {
    await showItems();
    showAlertItem();
}

itemsDOM.addEventListener("click", async (event) => {
    const elm = event.target;

    if(elm.classList.contains("plus") || elm.classList.contains("minus")) {
        const id = elm.parentElement.dataset.id;
        const quantityElm = elm.parentElement.querySelector(".quantity");
        const quantity = parseInt(quantityElm.innerText);
        const delta = elm.classList.contains("plus") ? 1 : -1;

        try {
            await axios.patch(`/api/v1/items/${id}`, { quantity: quantity + delta });
            dataReload();
        } catch (err) {
            console.log(err);
        }
    }
});

dataReload();