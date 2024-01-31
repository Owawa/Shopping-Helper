const mongoose = require("mongoose");

const purchaseRecordSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
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
            validator: (value) => {
                return value >= this.quantityPurchased;
            },
            message: "買い物後の残数として、購入個数より小さな値を指定することはできません"
        }
    }
});

module.exports = mongoose.model("PurchaseRecord", purchaseRecordSchema);