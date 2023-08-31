const mongoose = require("mongoose");

const purchaseRecordSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    purchasedDate: {
        type: Date,
        required: true,
    },
    quantityRemaining: {
        type: Number,
        required: true,
    },
    quantityPurchased: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("PurchaseRecord", purchaseRecordSchema);