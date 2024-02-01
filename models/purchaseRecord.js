const mongoose = require("mongoose");

const purchaseRecordSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
        validate: {
            validator: async function(itemId) {
                return await mongoose.model("Item").exists({ _id: itemId });
            },
            message: function(props) { return `指定されたitem id(${props.value})は存在しません`; }
        }
    },
    purchasedDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    quantityPurchased: {
        type: Number,
        required: true,
        min: [1, "購入個数に1より小さな値を指定することはできません"],
    },
    quantityRemaining: {
        type: Number,
        required: true,
        min: [1, "買い物後の残数として、1より小さな値を指定することはできません"],
        validate: {
            validator: function(value) {
                return value >= this.quantityPurchased;
            },
            message: function(props) {
                return `買い物後の残数として、購入個数より小さな値を指定することはできません.`
                    + `指定された値(${props.value})`;
            }
        }
    }
});

module.exports = mongoose.model("PurchaseRecord", purchaseRecordSchema);