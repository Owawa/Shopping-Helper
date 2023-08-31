const purchaseRecordsDOM = document.querySelector(".purchase-records");
const purchaseRecordFormDOM = document.querySelector(".purchase-record-form");

const itemNameSelectDOM = document.querySelector(".item-name-select");

const showPurchaseRecords = async () => {
    try {
        const { data: records }  = await axios.get("/api/v1/purchase");

       // no records
        if (records.length < 1) {
            purchaseRecordsDOM.innerHTML = `<h5 class="emply-list">購入履歴が見つかりません.</h5>`;
            return;
        }
       
        // output purchase records
        const allRecords = records.map((record) => {
            const {_id, item, purchasedDate, quantityPurchased, quantityRemaining} = record;
            const dateString = new Date(purchasedDate).toLocaleDateString("ja");
            
            return `<div class="single-purchase-record" data-id="${_id}">
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
        purchaseRecordsDOM.innerHTML = allRecords;
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

showPurchaseRecords();
setItemOptions();


purchaseRecordFormDOM.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent reload behavior
});
