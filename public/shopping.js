const historiesDOM = document.querySelector(".histories");
const historyFormDOM = document.querySelector(".history-form");

const itemNameSelectDOM = document.querySelector(".item-name-select");

const showHistories = async () => {
    try {
        const { data: histories }  = await axios.get("/api/v1/history");

       // no history handle
        if (histories.length < 1) {
            historiesDOM.innerHTML = `<h5 class="emply-list">購入履歴が見つかりません.</h5>`;
            return;
        }
       
        // output histories
        const allHistories = histories.map((history) => {
            const {_id, item, purchasedDate, quantityPurchased, quantityRemaining} = history;
            const dateString = new Date(purchasedDate).toLocaleDateString("ja");
            
            return `<div class="single-history" data-id="${_id}">
                <h5 class="purchase-date">${dateString}</h5>
                <div class="item-name">${item.name}</div>
                <div class="quantity-info">
                    <p class="quantity-purchased">+${quantityPurchased}</p>
                    <p>(残: ${quantityRemaining})</p>
                </div>
                <button class="edit-btn">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
            </div>`;
        }).join("");
        historiesDOM.innerHTML = allHistories;
    } catch(err) {
        console.log(err);
    }
}

const setItemOptions = async () => {
    try {
        const {data: items} = await axios.get("/api/v1/items");
        const names = items.map( (item) => {
            const { name } = item;
            return `<option>${name}</option>`;
        }).join("");
        itemNameSelectDOM.innerHTML = `<option>-- Select item name ---</option>${names}`;
    } catch(err) {
        console.log(err);
    }
}

showHistories();
setItemOptions();

historyFormDOM.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent reload behavior
});
