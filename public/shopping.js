const historiesDOM = document.querySelector(".histories");
const historyFormDOM = document.querySelector(".history-form");

const categoryDOM = document.querySelector(".item-category-select");
const itemNameSelectDOM = document.querySelector(".item-name-select");
const purchasedDOM = document.querySelector("#qty-purchased");
const remainingDOM = document.querySelector("#qty-remaining");

const formAlertDOM = document.querySelector(".form-alert");

let selectedItemQty;
let itemData;

const showHistories = async () => {
    try {
        const { data: histories }  = await axios.get("/api/v1/history");

       // no history handle
        if (histories.length < 1) {
            historiesDOM.innerHTML = `<h5 class="emply-list">購入履歴が見つかりません.</h5>`;
            return;
        }
       
        // output histories
        const historyHTML = histories.map((history) => {
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
        historiesDOM.innerHTML = historyHTML;
    } catch(err) {
        console.log(err);
    }
}

const reloadItems = async () => {
    try {
        const res = await axios.get("/api/v1/items");
        itemData = res.data;
    } catch(err) {
        console.log(err);
    }
}

const setCategory = () => {
    let categories = ["--- カテゴリを選択 ---", "お掃除","お風呂", "スキンケア","ペーパー類","衛生用品","歯磨き","お洗濯","食料品"];
    
    categoryDOM.innerHTML = categories.map((c) => {
        return `<option>${c}</option>`;
    }).join("");
}

const setDefaultSelectElm = () => {
    const options = itemData.map( (item) => {
        const { _id, name } = item;
        return `<option value="${_id}">${name}</option>`;
    }).join("");
    itemNameSelectDOM.innerHTML = "<option value>--- 品目を選択 ---</option>" + options;
}

const dataReload = async () => {
    await reloadItems();
    await showHistories();
}

const init = async () => {
    await dataReload();
    setCategory();
    setDefaultSelectElm();
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("purchase-date").defaultValue = today;
}

categoryDOM.addEventListener("change", (e) => {
    const isCategorySelected = categoryDOM.selectedIndex !== 0;
    if(isCategorySelected) {
        const itemsInCategory = itemData.filter((item) => item.category === categoryDOM.value)
        .map((item) => {
            const { _id, name } = item;
            return `<option value="${_id}">${name}</option>`;
        }).join("");
        itemNameSelectDOM.innerHTML = "<option value>--- 品目を選択 ---</option>" + itemsInCategory;
    } else {
        setDefaultSelectElm();
    }
})

itemNameSelectDOM.addEventListener("change", (e) => {
    const targetItemId = itemNameSelectDOM.selectedOptions[0].value;
    if(targetItemId) {
        const targetItem = itemData.find( (item) => {
            return item._id === targetItemId;
        });
        selectedItemQty = targetItem.quantity;
    }
});

purchasedDOM.addEventListener("change", (e) => {
    // set min attr to be equal to qty-purchased
    remainingDOM.setAttribute("min", e.target.value);

    // set default remaining value
    const isItemSelected = itemNameSelectDOM.selectedIndex !== 0;
    if(isItemSelected) {
        remainingDOM.value = parseInt(purchasedDOM.value) + selectedItemQty;
    }
});

historyFormDOM.addEventListener("submit", async (event) => {
    event.preventDefault();

    const historyJSON = {
        item: itemNameSelectDOM.selectedOptions[0].value,
        quantityPurchased: purchasedDOM.value,
        quantityRemaining: remainingDOM.value,
        purchasedDate: new Date(
            document.getElementById("purchase-date").value
        ).toISOString()
    };

    try {
        await axios.post("/api/v1/history", historyJSON);
        dataReload();
        historyFormDOM.reset();
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "登録しました"
        formAlertDOM.classList.add("text-success");
    } catch(err) {
        console.error(err);
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "無効です. もう一度やり直してください.";        
        formAlertDOM.classList.add("text-failed");
    }
    setTimeout(() => {
        formAlertDOM.style.display = "none";
        formAlertDOM.classList.remove("text-success");
        formAlertDOM.classList.remove("text-failed");
    }, 3000);
});

init();